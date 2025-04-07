import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DishStatus } from '@/constants/enum'
import { useCreateDishMutation, useUpdateDishMutation } from '@/hooks/api/useDish'
import { useUploadSingleImageMutation } from '@/hooks/api/useMedia'
import { cn, getVietnameseDishStatusList, handleApiError } from '@/lib/utils'
import { CreateDishBodyType, createDishSchema } from '@/schemaValidations/dish.schema'
import { ICategory, IDish } from '@/types/backend.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash, Upload } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateDishDialogProp {
  open?: boolean
  type: 'update' | 'create'
  dish?: IDish
  categoryListData: ICategory[]
  onSuccess?: () => void
  onOpenChange: () => void
}

export default function UpsertDishDialog({
  onSuccess,
  open = false,
  onOpenChange,
  type,
  dish,
  categoryListData
}: CreateDishDialogProp) {
  const [file, setFile] = React.useState<File>()
  const preview = file ? URL.createObjectURL(file) : dish?.imageUrl
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const createDishMutation = useCreateDishMutation()
  const updateDishMutation = useUpdateDishMutation()
  const uploadSingleImageMutation = useUploadSingleImageMutation()

  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(createDishSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      category: categoryListData[0]._id,
      status: DishStatus.Available
    }
  })

  // Update case
  React.useEffect(() => {
    if (dish) {
      form.reset({ ...dish, category: dish.category?._id })
    }
  }, [dish, form])

  React.useEffect(() => {
    if (preview) {
      form.setValue('imageUrl', preview)
    }
  }, [form, preview])

  async function onSubmit(values: CreateDishBodyType) {
    try {
      let imageUrl = undefined
      if (file) {
        const formData = new FormData()
        formData.append('file', new Blob([file], { type: file.type }))
        const uploadImageRes = await uploadSingleImageMutation.mutateAsync({ body: formData, folderName: 'dishes' })
        imageUrl = uploadImageRes.data.result
      }

      if (type === 'create') {
        await createDishMutation.mutateAsync({ ...values, imageUrl: imageUrl ?? '' })
        toast('✅ Tạo mới món ăn thành công!')
      } else if (dish) {
        await updateDishMutation.mutateAsync({ id: dish._id, body: { ...values, imageUrl } })
        toast('✅ Cập nhật món ăn thành công!')
      }
      resetForm()
      onSuccess?.()
    } catch (error) {
      handleApiError({ error, setError: form.setError })
    }
  }

  function resetForm() {
    resetInputFile()
    form.reset({
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      status: DishStatus.Available,
      category: categoryListData[0]._id
    })
  }

  function resetInputFile() {
    setFile(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function onDialogClose() {
    onOpenChange()
    resetInputFile()
    resetForm()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className='min-w-[650px]'>
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'Thêm mới' : 'Chỉnh sửa'} món ăn</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form
              id='upsertDishForm'
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-x-3'>
                <div className='col-span1'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên món</FormLabel>
                        <FormControl>
                          <Input placeholder='Hãy nhập tên món ăn...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryListData.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Hãy nhập mô tả...' rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-x-3'>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='Hãy nhập giá...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getVietnameseDishStatusList().map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Label htmlFor='dishImage'>Hình ảnh minh họa </Label>
                    </FormLabel>
                    <div className='h-1'></div>
                    <div className='relative flex aspect-square w-36 items-center justify-center rounded-sm border border-gray-200'>
                      <Button
                        type='button'
                        size={'icon'}
                        variant={'destructive'}
                        className='absolute -right-3 -top-2'
                        onClick={resetInputFile}
                      >
                        <Trash size={10} />
                      </Button>
                      {preview ? (
                        <Image
                          src={preview}
                          alt={''}
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='h-full w-full rounded-sm object-cover'
                        />
                      ) : (
                        <span className='text-sm'>Preview</span>
                      )}
                    </div>
                    <FormControl>
                      <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Input
                          id='dishImage'
                          type='file'
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className='hidden'
                        />
                        <Label
                          htmlFor='dishImage'
                          className='flex w-36 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 py-2 text-sm shadow-sm'
                        >
                          <Upload size={16} />
                          Tải ảnh
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogDescription>
        <DialogFooter>
          <Button variant={'outline'} onClick={onDialogClose}>
            Hủy
          </Button>
          <Button
            form='upsertDishForm'
            type='submit'
            className={cn({
              'cursor-not-allowed opacity-50': createDishMutation.isPending || uploadSingleImageMutation.isPending
            })}
          >
            {createDishMutation.isPending ||
              (uploadSingleImageMutation.isPending && <Loader2 className='animate-spin' />)}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

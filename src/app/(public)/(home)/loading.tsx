import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div>
      {/* Carousel Skeleton */}
      <div className="relative">
        <div className="h-[30vh] md:h-[60vh]">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="absolute left-3 top-[50%] -translate-y-1/2">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="absolute right-3 top-[50%] -translate-y-1/2">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Main Content Section */}
      <section className="lg:container">
        {/* Menu Title Skeleton */}
        <div className="bg-gray-100 py-10 text-center md:bg-white md:py-20 lg:bg-white">
          <Skeleton className="mx-auto h-8 w-32 md:h-10 md:w-40" />
        </div>

        {/* Grid Layout */}
        <div className="lg:grid lg:grid-cols-24 lg:gap-x-7">
          {/* Categories Card Skeleton - Left Column */}
          <div className="col-span-5">
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-24" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Dishes Group Cards Skeleton - Middle Column */}
          <div className="px-3 md:px-10 lg:col-span-12 lg:px-0">
            {Array.from({ length: 4 }).map((_, categoryIndex) => (
              <div key={categoryIndex} className="mb-8 space-y-4">
                {/* Category Title */}
                <Skeleton className="h-8 w-48" />

                {/* Dish Items */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, dishIndex) => (
                    <div
                      key={dishIndex}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      {/* Dish Image */}
                      <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />

                      {/* Dish Info */}
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Orders Card Skeleton - Right Column */}
          <div className="col-span-7">
            <div className="sticky top-4 space-y-4 rounded-lg border p-4">
              {/* Orders Header */}
              <div className="border-b pb-4">
                <Skeleton className="h-6 w-32" />
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-4 w-8" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between font-semibold">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button Skeleton */}
      <div className="fixed bottom-6 right-6">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

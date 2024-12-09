import { Card, Divider, Skeleton } from "@nextui-org/react";

function DataLoadingSkeleton() { 

    return (
        <div className="mt-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="rounded-lg w-2/5">
                        <div className="h-3 w-36 rounded-lg bg-default-300" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className=" rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                    </Skeleton>
                </div>

                <Divider className="my-16 h-[1.72px]  bg-[#D9D9D9]" />

                <div className="mb-16">
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-200" />
                    </Skeleton>
                </div>
                <div className="w-full flex flex-col gap-11">
                {
                [1 , 2, 3 ,4].map((item , index) => (
                <Card key={index} className="w-full space-y-3 p-4 border-none" radius="lg">
                        <Skeleton className="rounded-lg">
                            <div className="h-4 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-4 w-4/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        
                        <div className="space-y-3 pt-3">
                        <Skeleton className="rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                        </Skeleton>
                        </div>
                        <div className="py-4">
                        <Skeleton className="w-3/5 rounded-lg ">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="w-3/5 flex justify-between">
                            <Skeleton className="w-3/5 rounded-lg ">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-1/12 rounded-lg ">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            </div>
                            <div className="flex items-center justify-between">
                            <Skeleton className="h-2 w-3/5 rounded-lg ">
                                <div className="h-2 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            <Skeleton className="w-1/12 rounded-lg ">
                                <div className="h-5 w-3/5 rounded-lg bg-default-200" />
                            </Skeleton>
                            </div>
                        </div>
                </Card>
                ))
                }
                </div>
            </div>
    )
}
export default DataLoadingSkeleton;
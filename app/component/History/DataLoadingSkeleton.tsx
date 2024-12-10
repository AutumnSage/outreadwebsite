import { Card, Divider, Skeleton } from "@nextui-org/react";

function DataLoadingSkeleton() { 
    const data = [1 , 2 , 3];
    return (    
        <div className="mt-7 mb-14">
            {data.map((item , index) => (
               <>
                <div className="flex flex-col gap-3">
                    <Skeleton className="rounded-lg w-2/5 mb-5">
                        <div className="h-5 w-36 rounded-lg bg-default-300" />
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
                </div>
                {
                    (index != data.length - 1) && (
                        <Divider className="my-16 h-[1.72px]  bg-[#D9D9D9]" />
                    )
                }
               </> 
            ))}
            
            </div>
    )
}
export default DataLoadingSkeleton;
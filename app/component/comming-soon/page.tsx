import { Button } from "@nextui-org/react";
import DownloadFromAppStoreBlack from "../General/DownloadAppStoreButton";

export default function CommingSoon() {
    return <div
        className="h-[300px] w-full items-center flex justify-center bg-white text-black text-center" >
        <div className="font-semibold text-4xl my-2">
            More will be comming soon....
            {/* <div>
                <a href="/subscription">
                    <Button variant="solid" className="mt-2">Manage Subscription here</Button>
                </a>
            </div> */}
            <div className="flex flex-col text-2xl justify-center my-2">
                For now checkout our app in the store
            </div>
            <DownloadFromAppStoreBlack width="120" height="50" />
        </div>

    </div>
}
import React from "react";
import { Button } from "@nextui-org/react";

interface DownloadButtonProps {
    width: string;
    height: string;
}

export default function DownloadFromAppStoreBlack({ width, height }: DownloadButtonProps) {
    return (
        <a href="https://apps.apple.com/us/app/outread/id6503236023?itscg=30200&itsct=apps_box_badge&mttnsubad=6503236023" style={{ display: 'inline-block' }}>
            <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1726358400" alt="Download on the App Store" style={{ width: width, height: height, verticalAlign: 'middle', objectFit: 'contain' }} />
        </a>
    )
}

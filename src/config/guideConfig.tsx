import { ReactNode } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface GuideConfig {
    [key: string]: {
        header: ReactNode;
        body: ReactNode;
    };
}

export const guideConfig: GuideConfig = {
    rise_fall: {
        header: <h2 className="text-lg font-bold pb-4">Rise/Fall</h2>,
        body: (
            <div className="space-y-4 text-sm">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Rise</h3>
                    <p className="text-theme mb-2">
                        If you select Rise, you win the payout if the exit spot is strictly higher
                        than the entry spot.
                    </p>
                    <DotLottieReact autoplay src="/videos/rise.lottie" loop />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Fall</h3>
                    <p className="text-theme mb-2">
                        If you select Fall, you win the payout if the exit spot is strictly lower
                        than the entry spot.
                    </p>
                    <DotLottieReact autoplay src="/videos/fall.lottie" loop />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Additional Information</h3>
                    <p className="text-theme mb-2">
                        If you select "Allow equals", you win the payout if exit spot is higher than
                        or equal to entry spot for Rise. Similarly, you win the payout if exit spot
                        is lower than or equal to entry spot for Fall.
                    </p>
                </div>
                <div className="py-4 border-t h-[252px]">
                    <iframe
                        className="rounded-3xl"
                        allowFullScreen={true}
                        width="100%"
                        height="100%"
                        src="https://iframe.cloudflarestream.com/7719c7e5436f58e59ab47510445108ba"
                    />
                </div>
            </div>
        ),
    },
};

import {
    MarketForexAudcadIcon,
    MarketForexAudchfIcon,
    MarketForexAudjpyIcon,
    MarketForexAudnzdIcon,
    MarketForexAudusdIcon,
    MarketDerivedAudBasketIcon,
    MarketDerivedBearIcon,
    MarketDerivedBoom1000Icon,
    MarketDerivedBoom600Icon,
    MarketDerivedBoom900Icon,
    MarketDerivedBoom300Icon,
    MarketDerivedBoom500Icon,
    MarketDerivedBullIcon,
    MarketDerivedCrash1000Icon,
    MarketDerivedCrash600Icon,
    MarketDerivedCrash900Icon,
    MarketDerivedCrash300Icon,
    MarketDerivedCrash500Icon,
    MarketCommoditySilverusdIcon,
    MarketCommodityGoldusdIcon,
    MarketCommodityPalladiumusdIcon,
    MarketCommodityPlatinumusdIcon,
    MarketCryptocurrencyBtcusdIcon,
    MarketCryptocurrencyEthusdIcon,
    MarketDerivedEurBasketIcon,
    MarketDerivedGbpBasketIcon,
    MarketDerivedGoldBasketIcon,
    MarketDerivedJump10Icon,
    MarketDerivedJump100Icon,
    MarketDerivedJump25Icon,
    MarketDerivedJump50Icon,
    MarketDerivedJump75Icon,
    MarketDerivedStepIndices100Icon,
    MarketDerivedStepIndices200Icon,
    MarketDerivedStepIndices300Icon,
    MarketDerivedStepIndices400Icon,
    MarketDerivedStepIndices500Icon,
    MarketDerivedUsdBasketIcon,
    MarketDerivedVolatility101sIcon,
    MarketDerivedVolatility1001sIcon,
    MarketDerivedVolatility1501sIcon,
    MarketDerivedVolatility2501sIcon,
    MarketDerivedVolatility251sIcon,
    MarketDerivedVolatility501sIcon,
    MarketDerivedVolatility751sIcon,
    MarketForexEuraudIcon,
    MarketForexEurcadIcon,
    MarketForexEurchfIcon,
    MarketForexEurgbpIcon,
    MarketForexEurjpyIcon,
    MarketForexEurnzdIcon,
    MarketForexEurusdIcon,
    MarketForexGbpaudIcon,
    MarketForexGbpcadIcon,
    MarketForexGbpchfIcon,
    MarketForexGbpjpyIcon,
    MarketForexGbpnokIcon,
    MarketForexGbpnzdIcon,
    MarketForexGbpusdIcon,
    MarketForexNzdjpnIcon,
    MarketForexNzdusdIcon,
    MarketForexUsdcadIcon,
    MarketForexUsdchfIcon,
    MarketForexUsdjpyIcon,
    MarketForexUsdmxnIcon,
    MarketForexUsdnokIcon,
    MarketForexUsdplnIcon,
    MarketForexUsdsekIcon,
    MarketIndicesAustralia200Icon,
    MarketIndicesEuro50Icon,
    MarketIndicesFrance40Icon,
    MarketIndicesGerman40Icon,
    MarketIndicesHongKong50Icon,
    MarketIndicesJapan225Icon,
    MarketIndicesNetherlands25Icon,
    MarketIndicesSwiss20Icon,
    MarketIndicesUk100Icon,
    MarketIndicesUs500Icon,
    MarketIndicesUsTech100Icon,
    MarketIndicesWallStreet30Icon,
    MarketDerivedVolatility10Icon,
    MarketDerivedVolatility100Icon,
    MarketDerivedVolatility25Icon,
    MarketDerivedVolatility50Icon,
    MarketDerivedVolatility75Icon,
} from "@deriv/quill-icons";
import type { IconTypes } from "@deriv/quill-icons";

export const marketIcons: {
    [key: string]: IconTypes;
} = {
    frxAUDCAD: MarketForexAudcadIcon,
    frxAUDCHF: MarketForexAudchfIcon,
    frxAUDJPY: MarketForexAudjpyIcon,
    frxAUDNZD: MarketForexAudnzdIcon,
    frxAUDUSD: MarketForexAudusdIcon,
    WLDAUD: MarketDerivedAudBasketIcon,
    RDBEAR: MarketDerivedBearIcon,
    BOOM1000: MarketDerivedBoom1000Icon,
    BOOM600: MarketDerivedBoom600Icon,
    BOOM900: MarketDerivedBoom900Icon,
    BOOM300N: MarketDerivedBoom300Icon,
    BOOM500: MarketDerivedBoom500Icon,
    RDBULL: MarketDerivedBullIcon,
    CRASH1000: MarketDerivedCrash1000Icon,
    CRASH600: MarketDerivedCrash600Icon,
    CRASH900: MarketDerivedCrash900Icon,
    CRASH300N: MarketDerivedCrash300Icon,
    CRASH500: MarketDerivedCrash500Icon,
    frxXAGUSD: MarketCommoditySilverusdIcon,
    frxXAUUSD: MarketCommodityGoldusdIcon,
    frxXPDUSD: MarketCommodityPalladiumusdIcon,
    frxXPTUSD: MarketCommodityPlatinumusdIcon,
    cryBTCUSD: MarketCryptocurrencyBtcusdIcon,
    cryETHUSD: MarketCryptocurrencyEthusdIcon,
    WLDEUR: MarketDerivedEurBasketIcon,
    WLDGBP: MarketDerivedGbpBasketIcon,
    WLDXAU: MarketDerivedGoldBasketIcon,
    JD10: MarketDerivedJump10Icon,
    JD100: MarketDerivedJump100Icon,
    JD25: MarketDerivedJump25Icon,
    JD50: MarketDerivedJump50Icon,
    JD75: MarketDerivedJump75Icon,
    stpRNG: MarketDerivedStepIndices100Icon,
    stpRNG2: MarketDerivedStepIndices200Icon,
    stpRNG3: MarketDerivedStepIndices300Icon,
    stpRNG4: MarketDerivedStepIndices400Icon,
    stpRNG5: MarketDerivedStepIndices500Icon,
    WLDUSD: MarketDerivedUsdBasketIcon,
    "1HZ10V": MarketDerivedVolatility101sIcon,
    "1HZ100V": MarketDerivedVolatility1001sIcon,
    "1HZ150V": MarketDerivedVolatility1501sIcon,
    "1HZ250V": MarketDerivedVolatility2501sIcon,
    "1HZ25V": MarketDerivedVolatility251sIcon,
    "1HZ50V": MarketDerivedVolatility501sIcon,
    "1HZ75V": MarketDerivedVolatility751sIcon,
    frxEURAUD: MarketForexEuraudIcon,
    frxEURCAD: MarketForexEurcadIcon,
    frxEURCHF: MarketForexEurchfIcon,
    frxEURGBP: MarketForexEurgbpIcon,
    frxEURJPY: MarketForexEurjpyIcon,
    frxEURNZD: MarketForexEurnzdIcon,
    frxEURUSD: MarketForexEurusdIcon,
    frxGBPAUD: MarketForexGbpaudIcon,
    frxGBPCAD: MarketForexGbpcadIcon,
    frxGBPCHF: MarketForexGbpchfIcon,
    frxGBPJPY: MarketForexGbpjpyIcon,
    frxGBPNOK: MarketForexGbpnokIcon,
    frxGBPNZD: MarketForexGbpnzdIcon,
    frxGBPUSD: MarketForexGbpusdIcon,
    frxNZDJPY: MarketForexNzdjpnIcon,
    frxNZDUSD: MarketForexNzdusdIcon,
    frxUSDCAD: MarketForexUsdcadIcon,
    frxUSDCHF: MarketForexUsdchfIcon,
    frxUSDJPY: MarketForexUsdjpyIcon,
    frxUSDMXN: MarketForexUsdmxnIcon,
    frxUSDNOK: MarketForexUsdnokIcon,
    frxUSDPLN: MarketForexUsdplnIcon,
    frxUSDSEK: MarketForexUsdsekIcon,
    OTC_AS51: MarketIndicesAustralia200Icon,
    OTC_SX5E: MarketIndicesEuro50Icon,
    OTC_FCHI: MarketIndicesFrance40Icon,
    OTC_GDAXI: MarketIndicesGerman40Icon,
    OTC_HSI: MarketIndicesHongKong50Icon,
    OTC_N225: MarketIndicesJapan225Icon,
    OTC_AEX: MarketIndicesNetherlands25Icon,
    OTC_SSMI: MarketIndicesSwiss20Icon,
    OTC_FTSE: MarketIndicesUk100Icon,
    OTC_SPC: MarketIndicesUs500Icon,
    OTC_NDX: MarketIndicesUsTech100Icon,
    OTC_DJI: MarketIndicesWallStreet30Icon,
    R_10: MarketDerivedVolatility10Icon,
    R_100: MarketDerivedVolatility100Icon,
    R_25: MarketDerivedVolatility25Icon,
    R_50: MarketDerivedVolatility50Icon,
    R_75: MarketDerivedVolatility75Icon,
} as const;

import { DiscordAppLogo, FBLogo, KakaotalkAppLogo, LineAppLogo, TelegramLogo, ViberAppLogo, WechatAppLogo, WhatsAppLogo } from "@/common/utils/data"

export const getMessengerIcon = (app: string): string => {
          let icon: string = ""
          const map:{ [key: string]: any } = {
            "telegram":TelegramLogo,
            "whatsapp":WhatsAppLogo,
            "discord": DiscordAppLogo,
            "viber":ViberAppLogo,
            "facebook messenger":FBLogo,
            "line":LineAppLogo,
            "wechat":WechatAppLogo,
            "kakaotalk": KakaotalkAppLogo
          }

         icon = map[app] ?? ""
         return icon
}
import ButtonWidgetIcon from "@/assets/widgetCover/button.svg?react"
import i18n from "@/i18n/config"
import { WidgetConfig } from "@/widgetLibrary/interface"

export const BUTTON_WIDGET_CONFIG: WidgetConfig = {
  type: "BUTTON_WIDGET",
  displayName: "button",
  widgetName: i18n.t("widget.button.name"),
  keywords: ["Button", "按钮"],
  icon: <ButtonWidgetIcon />,
  sessionType: "PRESENTATION",
  w: 6,
  h: 5,
  version: 0,
  defaults: {
    text: i18n.t("widget.button.default_text"),
    fill: "fill",
    hidden: false,
  },
}

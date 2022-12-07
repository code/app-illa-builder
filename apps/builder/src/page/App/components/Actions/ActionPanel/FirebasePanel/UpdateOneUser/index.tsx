import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { CodeEditor } from "@/components/CodeEditor"
import {
  codeEditorLabelStyle,
  actionItemCodeEditorStyle,
  actionItemStyle,
} from "@/page/App/components/Actions/ActionPanel/FirebasePanel/style"
import { getCachedAction } from "@/redux/config/configSelector"
import { configActions } from "@/redux/config/configSlice"
import { ActionItem } from "@/redux/currentApp/action/actionState"
import { VALIDATION_TYPES } from "@/utils/validationFactory"
import { FirebaseActionPartProps } from "@/page/App/components/Actions/ActionPanel/FirebasePanel/intreface"
import {
  FirebaseAction,
  FirebaseContentType,
  UpdateOneUser,
} from "@/redux/currentApp/action/firebaseAction"

export const UpdateOneUserPart: FC<FirebaseActionPartProps> = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cachedAction = useSelector(getCachedAction) as ActionItem<
    FirebaseAction<FirebaseContentType>
  >
  const options = props.options as UpdateOneUser

  const handleValueChange = (value: string, name: string) => {
    dispatch(
      configActions.updateCachedAction({
        ...cachedAction,
        content: {
          ...cachedAction.content,
          options: {
            ...options,
            [name]: value,
          },
        },
      }),
    )
  }

  return (
    <>
      <div css={actionItemStyle}>
        <span css={codeEditorLabelStyle}>
          {t("editor.action.panel.firebase.uid")}
        </span>
        <CodeEditor
          css={actionItemCodeEditorStyle}
          mode="TEXT_JS"
          value={options.uid}
          onChange={(value) => handleValueChange(value, "uid")}
          expectedType={VALIDATION_TYPES.STRING}
        />
      </div>
      <div css={actionItemStyle}>
        <span css={codeEditorLabelStyle}>
          {t("editor.action.panel.firebase.user_object")}
        </span>
        <CodeEditor
          css={actionItemCodeEditorStyle}
          mode="TEXT_JS"
          value={options.userObj}
          onChange={(value) => handleValueChange(value, "userObj")}
          expectedType={VALIDATION_TYPES.STRING}
        />
      </div>
    </>
  )
}

UpdateOneUserPart.displayName = "UpdateOneUserPart"

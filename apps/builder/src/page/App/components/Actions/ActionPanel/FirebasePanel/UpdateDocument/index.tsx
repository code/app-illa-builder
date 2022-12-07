import { FC, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { CodeEditor } from "@/components/CodeEditor"
import { Select } from "@illa-design/react"
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
  FirebaseServiceType,
  UpdateDocument,
} from "@/redux/currentApp/action/firebaseAction"
import {
  actionBodyTypeStyle,
  actionItemLabelStyle,
} from "@/page/App/components/Actions/ActionPanel/FirebasePanel/style"
import { useForm } from "react-hook-form"

export const UpdateDocumentPart: FC<FirebaseActionPartProps> = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cachedAction = useSelector(getCachedAction) as ActionItem<
    FirebaseAction<FirebaseContentType>
  >
  const options = props.options as UpdateDocument
  const isDropdown = options.collectionType === "dropdown"

  const { control } = useForm({
    mode: "onChange",
    shouldUnregister: true,
  })

  const handleValueChange = (value: string | boolean, name: string) => {
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

  const handleCollectionTypeChange = useCallback(() => {
    const contentType = isDropdown ? "raw" : "dropdown"
    handleValueChange(contentType, "collectionType")
  }, [handleValueChange])

  return (
    <>
      <div css={actionItemStyle}>
        <span css={actionItemLabelStyle}>
          {t("editor.action.panel.firebase.collection")}
          <span css={actionBodyTypeStyle} onClick={handleCollectionTypeChange}>
            {isDropdown
              ? t("editor.action.panel.firebase.use_raw_id")
              : t("editor.action.panel.firebase.use_a_dropdown")}
          </span>
        </span>
        {isDropdown ? (
          <Select
            colorScheme="techPurple"
            showSearch={true}
            defaultValue={options.collection}
            value={options.collection}
            ml="16px"
            width="100%"
            placeholder={t(
              "editor.action.panel.firebase.placeholder.select_collection",
            )}
            onChange={(value) => handleValueChange(value, "collection")}
            options={FirebaseServiceType}
          />
        ) : (
          <CodeEditor
            css={actionItemCodeEditorStyle}
            mode="TEXT_JS"
            value={options.collection}
            onChange={(value) => handleValueChange(value, "collection")}
            placeholder={t(
              "editor.action.panel.firebase.placeholder.input_collection",
            )}
            expectedType={VALIDATION_TYPES.STRING}
          />
        )}
      </div>

      <div css={actionItemStyle}>
        <span css={codeEditorLabelStyle}>
          {t("editor.action.panel.firebase.document_id")}
        </span>
        <CodeEditor
          css={actionItemCodeEditorStyle}
          mode="TEXT_JS"
          value={options.documentID}
          onChange={(value) => handleValueChange(value, "documentID")}
          expectedType={VALIDATION_TYPES.STRING}
        />
      </div>

      <div css={actionItemStyle}>
        <span css={codeEditorLabelStyle}>
          {t("editor.action.panel.firebase.value")}
        </span>
        <CodeEditor
          css={actionItemCodeEditorStyle}
          mode="TEXT_JS"
          value={options.value}
          onChange={(value) => handleValueChange(value, "value")}
          expectedType={VALIDATION_TYPES.STRING}
        />
      </div>
    </>
  )
}

UpdateDocumentPart.displayName = "UpdateDocumentPart"

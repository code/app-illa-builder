import { Checkbox, Space } from "antd-mobile"
import { FC, useCallback, useEffect, useMemo } from "react"
import { AutoHeightContainer } from "@/widgetLibrary/PC/PublicSector/AutoHeightContainer"
import { InvalidMessage } from "@/widgetLibrary/PC/PublicSector/InvalidMessage"
import { handleValidateCheck } from "@/widgetLibrary/PC/PublicSector/InvalidMessage/utils"
import { Label } from "@/widgetLibrary/PC/PublicSector/Label"
import { TooltipWrapper } from "@/widgetLibrary/PC/PublicSector/TooltipWrapper"
import {
  applyCenterLabelAndComponentWrapperStyle,
  applyValidateMessageWrapperStyle,
} from "@/widgetLibrary/PC/PublicSector/TransformWidgetWrapper/style"
import { formatSelectOptions } from "@/widgetLibrary/PC/PublicSector/utils/formatSelectOptions"
import {
  CheckboxGroupWidgetProps,
  WrappedCheckboxGroupProps,
} from "./interface"

export const WrappedCheckbox: FC<WrappedCheckboxGroupProps> = (props) => {
  const {
    value,
    disabled,
    direction,
    options,
    handleOnChange,
    getValidateMessage,
    handleUpdateMultiExecutionResult,
    displayName,
  } = props

  const changeValue = (value?: unknown) => {
    new Promise((resolve) => {
      const message = getValidateMessage(value)
      handleUpdateMultiExecutionResult([
        {
          displayName,
          value: {
            value: value || "",
            validateMessage: message,
          },
        },
      ])
      resolve(true)
    }).then(() => {
      handleOnChange?.()
    })
  }

  return (
    <Checkbox.Group
      disabled={disabled}
      value={value}
      onChange={(val) => {
        changeValue(val as string[])
      }}
    >
      <Space direction={direction}>
        {options?.map((o) => (
          <Checkbox key={o.label} value={o.value}>
            {o.label}
          </Checkbox>
        ))}
      </Space>
    </Checkbox.Group>
  )
}

WrappedCheckbox.displayName = "WrappedCheckbox"

export const CheckboxWidget: FC<CheckboxGroupWidgetProps> = (props) => {
  const {
    value,
    optionConfigureMode,
    manualOptions,
    mappedOption,
    handleUpdateDsl,
    updateComponentRuntimeProps,
    deleteComponentRuntimeProps,
    labelPosition,
    labelFull,
    label,
    labelAlign,
    labelWidth = 33,
    labelCaption,
    labelWidthUnit,
    required,
    labelHidden,
    tooltipText,
    customRule,
    hideValidationMessage,
    validateMessage,
    updateComponentHeight,
    triggerEventHandler,
  } = props

  const finalOptions = useMemo(() => {
    return formatSelectOptions(optionConfigureMode, manualOptions, mappedOption)
  }, [optionConfigureMode, manualOptions, mappedOption])

  const getValidateMessage = useCallback(
    (value?: unknown) => {
      if (!hideValidationMessage) {
        const message = handleValidateCheck({
          value,
          required,
          customRule,
        })
        const showMessage = message && message.length > 0
        return showMessage ? message : ""
      }
      return ""
    },
    [customRule, hideValidationMessage, required],
  )

  const handleValidate = useCallback(
    (value?: unknown) => {
      const message = getValidateMessage(value)
      handleUpdateDsl({
        validateMessage: message,
      })
      return message
    },
    [getValidateMessage, handleUpdateDsl],
  )

  useEffect(() => {
    updateComponentRuntimeProps({
      setValue: (value: any) => {
        handleUpdateDsl({ value })
      },
      clearValue: () => {
        handleUpdateDsl({ value: undefined })
      },
      validate: () => {
        return handleValidate(value)
      },
      clearValidation: () => {},
    })
    return () => {
      deleteComponentRuntimeProps()
    }
  }, [
    deleteComponentRuntimeProps,
    handleUpdateDsl,
    handleValidate,
    updateComponentRuntimeProps,
    value,
  ])

  const handleOnChange = useCallback(() => {
    triggerEventHandler("change")
  }, [triggerEventHandler])

  return (
    <AutoHeightContainer updateComponentHeight={updateComponentHeight}>
      <TooltipWrapper tooltipText={tooltipText} tooltipDisabled={!tooltipText}>
        <div css={applyCenterLabelAndComponentWrapperStyle(labelPosition)}>
          <Label
            labelFull={labelFull}
            label={label}
            labelAlign={labelAlign}
            labelWidth={labelWidth}
            labelCaption={labelCaption}
            labelWidthUnit={labelWidthUnit}
            labelPosition={labelPosition}
            required={required}
            labelHidden={labelHidden}
            hasTooltip={!!tooltipText}
          />
          <WrappedCheckbox
            {...props}
            options={finalOptions}
            getValidateMessage={getValidateMessage}
            handleOnChange={handleOnChange}
          />
        </div>
      </TooltipWrapper>
      {!hideValidationMessage && (
        <div
          css={applyValidateMessageWrapperStyle(
            labelWidth,
            labelPosition,
            labelHidden || !label,
          )}
        >
          <InvalidMessage validateMessage={validateMessage} />
        </div>
      )}
    </AutoHeightContainer>
  )
}

CheckboxWidget.displayName = "CheckboxWidget"
export default CheckboxWidget

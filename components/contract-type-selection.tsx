"use client"

import { useState } from "react"
import { FileText, PlusCircle, MinusCircle, Upload, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const contractScenarios = [
  {
    id: "computing_network_income",
    name: "算网数智类合同 - 收入",
    icon: PlusCircle,
    description: "适用于算网数智业务收入类合同",
    color: "text-green-600",
    bgColor: "bg-green-50",
    template: "算网数智收入合同模板",
    fields: [
      { name: "客户名称", required: true, type: "text" },
      { name: "合同金额", required: true, type: "number" },
      { name: "项目名称", required: true, type: "text" },
      { name: "签订日期", required: true, type: "date" },
      { name: "履行期限", required: true, type: "text" },
    ],
    attachments: [
      { name: "经济预审工单", required: true },
      { name: "中标通知书", required: true },
      { name: "标签决策单", required: true },
    ],
  },
  {
    id: "computing_network_expense",
    name: "算网数智类合同 - 支出",
    icon: MinusCircle,
    description: "适用于算网数智业务支出类合同",
    color: "text-red-600",
    bgColor: "bg-red-50",
    template: "算网数智支出合同模板",
    fields: [
      { name: "供应商名称", required: true, type: "text" },
      { name: "采购金额", required: true, type: "number" },
      { name: "采购内容", required: true, type: "text" },
      { name: "签订日期", required: true, type: "date" },
      { name: "交付期限", required: true, type: "text" },
    ],
    attachments: [
      { name: "采购销售合同扫描件", required: true },
      { name: "询价结果审批单", required: true },
    ],
  },
  {
    id: "non_computing_network",
    name: "非算网数智类合同",
    icon: FileText,
    description: "适用于其他类型合同",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    template: "通用合同模板",
    fields: [
      { name: "合同标题", required: true, type: "text" },
      { name: "合同金额", required: true, type: "number" },
      { name: "对方单位", required: true, type: "text" },
      { name: "签订日期", required: true, type: "date" },
      { name: "合同期限", required: true, type: "text" },
    ],
    attachments: [{ name: "事前审批附件", required: true }],
  },
  {
    id: "manual_upload",
    name: "手动上传合同",
    icon: Upload,
    description: "直接上传现有合同文件进行管理",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    template: "无模板",
    fields: [],
    attachments: [
      { name: "合同文件", required: true }
    ],
  },
]

interface Props {
  onContractCreated: (contract: any) => void
}

export function ContractTypeSelection({ onContractCreated }: Props) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})
  const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, File>>({})

  const selectedScenario = contractScenarios.find((s) => s.id === selectedType)

  const validateForm = () => {
    if (!selectedScenario) return false
    const errors: Record<string, boolean> = {}
    let hasError = false

    selectedScenario.fields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        errors[field.name] = true
        hasError = true
      }
    })

    selectedScenario.attachments.forEach((attachment) => {
      if (attachment.required && !uploadedAttachments[attachment.name]) {
        errors[`attachment_${attachment.name}`] = true
        hasError = true
      }
    })

    setFormErrors(errors)
    return !hasError
  }

  const handleAttachmentUpload = (attachmentName: string, file: File | null) => {
    if (file) {
      setUploadedAttachments({ ...uploadedAttachments, [attachmentName]: file })
      setFormErrors({ ...formErrors, [`attachment_${attachmentName}`]: false })
    }
  }

  const handleSubmit = () => {
    // if (!validateForm()) return

    const contract = {
      id: `CT${Date.now()}`,
      scenario: selectedScenario?.name,
      scenarioId: selectedType,
      template: selectedScenario?.template,
      data: formData,
      attachments: Object.keys(uploadedAttachments),
      status: "draft",
      createdAt: new Date().toISOString(),
      createdBy: "张三",
      currentVersion: 0,
      versions: [],
      aiReviewStatus: null,
    }

    onContractCreated(contract)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {!selectedType ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-balance mb-2">选择合同场景</h2>
            <p className="text-muted-foreground">请选择您要创建的合同场景，系统将基于场景生成相应的合同模板</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contractScenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <Card
                  key={scenario.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary group"
                  onClick={() => setSelectedType(scenario.id)}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-xl ${scenario.bgColor} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${scenario.color}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-balance">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{scenario.template}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => setSelectedType(null)} className="mb-6">
            ← 返回选择
          </Button>

          <Card className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {selectedScenario && (
                  <div className={`w-10 h-10 rounded-lg ${selectedScenario.bgColor} flex items-center justify-center`}>
                    {<selectedScenario.icon className={`w-5 h-5 ${selectedScenario.color}`} />}
                  </div>
                )}
                <h2 className="text-xl font-bold text-balance">{selectedScenario?.name}</h2>
              </div>
              <p className="text-muted-foreground">填写必填信息并上传相关附件后，系统将基于模板自动生成合同</p>
            </div>

            {/* 基本信息 */}
            {selectedScenario?.fields.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                    1
                  </div>
                  基本信息
                </h3>
                <div className="space-y-4">
                  {selectedScenario.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-2">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.name] || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, [field.name]: e.target.value })
                          setFormErrors({ ...formErrors, [field.name]: false })
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg border ${
                          formErrors[field.name] ? "border-red-500" : "border-input"
                        } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                        placeholder={`请输入${field.name}`}
                      />
                      {formErrors[field.name] && <p className="text-sm text-red-500 mt-1">此项为必填项</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 附件上传 */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                  {selectedScenario?.fields.length > 0 ? 2 : 1}
                </div>
                附件上传
              </h3>
              <div className="space-y-4">
                {selectedScenario?.attachments.map((attachment) => (
                  <div key={attachment.name}>
                    <label className="block text-sm font-medium mb-2">
                      {attachment.name}
                      {attachment.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 ${
                        formErrors[`attachment_${attachment.name}`]
                          ? "border-red-500 bg-red-50"
                          : "border-input bg-accent"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleAttachmentUpload(attachment.name, e.target.files?.[0] || null)}
                        className="hidden"
                        id={`attachment-${attachment.name}`}
                      />
                      <label htmlFor={`attachment-${attachment.name}`} className="cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {uploadedAttachments[attachment.name] ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium">{uploadedAttachments[attachment.name].name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(uploadedAttachments[attachment.name].size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">点击上传{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">支持 PDF、Word、图片格式</p>
                                </div>
                              </>
                            )}
                          </div>
                          <Button type="button" size="sm" variant="outline">
                            选择文件
                          </Button>
                        </div>
                      </label>
                    </div>
                    {formErrors[`attachment_${attachment.name}`] && (
                      <p className="text-sm text-red-500 mt-1">此附件为必传项</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">关于合同{selectedScenario?.template === "无模板" ? "文件" : "模板"}</p>
                  <p className="text-blue-700">
                    {selectedScenario?.template === "无模板"
                      ? "提交后系统将直接使用您上传的合同文件进行管理。"
                      : `提交后系统将基于 "${selectedScenario?.template}" 自动生成合同文档，您可以下载后进行编辑修改，修改完成后上传进行AI审核。`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="flex-1 h-11">
                创建合同并进入起草
              </Button>
              <Button variant="outline" onClick={() => setSelectedType(null)} className="h-11">
                取消
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

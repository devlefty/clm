"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  History,
  Lock,
  User,
  Calendar,
  MessageSquare,
  Highlighter,
  Users,
} from "lucide-react"
import { ContractStamping } from "./contract-stamping"

interface Annotation {
  id: string
  selectedText: string
  location: string
  comment: string
  type: "error" | "warning" | "suggestion"
  reviewer: string
  timestamp: string
  position?: { start: number; end: number }
}

export function ContractApproval({ contracts, setContracts, onNavigate }: any) {
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [showStampPage, setShowStampPage] = useState(false)
  const [comment, setComment] = useState("")
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [annotationType, setAnnotationType] = useState<"error" | "warning" | "suggestion">("warning")
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [annotationComment, setAnnotationComment] = useState("")
  const [delegateTo, setDelegateTo] = useState("")
  const [countersignTo, setCountersignTo] = useState("")
  const [showDelegateForm, setShowDelegateForm] = useState(false)
  const [showCountersignForm, setShowCountersignForm] = useState(false)

  const pendingContracts = contracts.filter((c: any) => c.status === "pending_approval")
  const approvedContracts = contracts.filter((c: any) => c.status === "approved")

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 0) {
      setSelectedText(text)
      setIsSelecting(true)
    }
  }

  const handleAddAnnotation = () => {
    if (!selectedText || !annotationComment) return

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      selectedText: selectedText,
      location: "第X条",
      comment: annotationComment,
      type: annotationType,
      reviewer: "李经理",
      timestamp: new Date().toISOString(),
    }

    setAnnotations([...annotations, newAnnotation])
    setIsSelecting(false)
    setSelectedText("")
    setAnnotationComment("")
    setAnnotationType("warning")
  }

  const handleApproveWithAnnotations = () => {
    const currentStep = selectedContract.approvalFlow.findIndex((step: any) => step.status === "pending")
    const updatedFlow = [...selectedContract.approvalFlow]

    if (currentStep !== -1) {
      updatedFlow[currentStep] = {
        ...updatedFlow[currentStep],
        status: "approved",
        comment: comment,
        timestamp: new Date().toISOString(),
        annotations: annotations.length > 0 ? annotations : undefined,
      }

      // 激活下一步
      if (currentStep + 1 < updatedFlow.length) {
        updatedFlow[currentStep + 1].status = "pending"
      }
    }

    const newHistory = {
      action: "approve",
      operator: "李经理",
      role: "部门经理",
      timestamp: new Date().toISOString(),
      comment: comment || "审批通过",
      version: selectedContract.currentVersion,
      annotations: annotations.length > 0 ? annotations : undefined,
    }

    // 检查是否是最后一步审批
    const isLastStep = currentStep === selectedContract.approvalFlow.length - 1
    const allApproved = updatedFlow.every((step: any) => step.status === "approved")

    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              status: isLastStep || allApproved ? "approved" : "pending_approval",
              approvalFlow: updatedFlow,
              approvedAt: isLastStep || allApproved ? new Date().toISOString() : c.approvedAt,
              approvedBy: isLastStep || allApproved ? "李经理" : c.approvedBy,
              approvalHistory: [...(c.approvalHistory || []), newHistory],
            }
          : c,
      ),
    )
    setSelectedContract(null)
    setComment("")
    setAnnotations([])
  }

  const handleReject = () => {
    const currentStep = selectedContract.approvalFlow.findIndex((step: any) => step.status === "pending")
    const updatedFlow = [...selectedContract.approvalFlow]

    if (currentStep !== -1) {
      updatedFlow[currentStep] = {
        ...updatedFlow[currentStep],
        status: "rejected",
        comment: comment,
        timestamp: new Date().toISOString(),
        annotations: annotations.length > 0 ? annotations : undefined,
      }
    }

    const newHistory = {
      action: "reject",
      operator: "李经理",
      role: "部门经理",
      timestamp: new Date().toISOString(),
      comment: comment || "需要修改",
      version: selectedContract.currentVersion,
      annotations: annotations.length > 0 ? annotations : undefined,
    }

    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              status: annotations.length > 0 ? "revision_needed" : "rejected",
              approvalFlow: updatedFlow,
              rejectedAt: new Date().toISOString(),
              rejectedBy: "李经理",
              rejectionReason: comment,
              annotations: annotations.length > 0 ? annotations : undefined,
              approvalHistory: [...(c.approvalHistory || []), newHistory],
            }
          : c,
      ),
    )
    setSelectedContract(null)
    setComment("")
    setAnnotations([])
  }

  const handleDelegate = () => {
    if (!delegateTo) return

    const currentStep = selectedContract.approvalFlow.findIndex((step: any) => step.status === "pending")
    const updatedFlow = [...selectedContract.approvalFlow]

    updatedFlow[currentStep] = {
      ...updatedFlow[currentStep],
      name: delegateTo,
      status: "pending",
    }

    const newHistory = {
      action: "delegate",
      operator: "李经理",
      role: "部门经理",
      timestamp: new Date().toISOString(),
      comment: `转派给 ${delegateTo}`,
      version: selectedContract.currentVersion,
    }

    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              approvalFlow: updatedFlow,
              approvalHistory: [...(c.approvalHistory || []), newHistory],
            }
          : c,
      ),
    )
    setSelectedContract(null)
    setShowDelegateForm(false)
    setDelegateTo("")
    setComment("")
    setAnnotations([])
  }

  const handleCountersign = () => {
    if (!countersignTo) return

    const currentStep = selectedContract.approvalFlow.findIndex((step: any) => step.status === "pending")
    const updatedFlow = [...selectedContract.approvalFlow]

    const newStep = {
      step: updatedFlow.length + 1,
      role: "加签审批人",
      name: countersignTo,
      status: "pending",
      isCountersign: true,
    }

    updatedFlow.splice(currentStep + 1, 0, newStep)

    // 重新编号
    updatedFlow.forEach((step, index) => {
      step.step = index + 1
    })

    const newHistory = {
      action: "countersign",
      operator: "李经理",
      role: "部门经理",
      timestamp: new Date().toISOString(),
      comment: `加签 ${countersignTo}`,
      version: selectedContract.currentVersion,
    }

    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              approvalFlow: updatedFlow,
              approvalHistory: [...(c.approvalHistory || []), newHistory],
            }
          : c,
      ),
    )
    setSelectedContract(null)
    setShowCountersignForm(false)
    setCountersignTo("")
    setComment("")
    setAnnotations([])
  }

  if (showStampPage && selectedContract) {
    return (
      <ContractStamping
        contract={selectedContract}
        onBack={() => {
          setShowStampPage(false)
          setSelectedContract(null)
        }}
        onComplete={(stampedContract: any) => {
          setContracts(contracts.map((c: any) => (c.id === stampedContract.id ? stampedContract : c)))
          setShowStampPage(false)
          setSelectedContract(null)
        }}
      />
    )
  }

  if (selectedContract) {
    const currentStep = selectedContract.approvalFlow?.findIndex((step: any) => step.status === "pending") ?? -1
    const isPendingMyApproval = selectedContract.status === "pending_approval" && currentStep !== -1

    return (
      <div className="max-w-[1600px] mx-auto">
        <Button variant="ghost" onClick={() => setSelectedContract(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：合同内容预览（占2列） */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-balance mb-1">{selectedContract.scenario}</h3>
                    <p className="text-sm text-muted-foreground mb-2">合同编号: {selectedContract.id}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedContract.createdAt).toLocaleString("zh-CN")}</span>
                      </div>
                      {selectedContract.versions && selectedContract.versions[0]?.locked && (
                        <div className="flex items-center gap-1.5 text-orange-600">
                          <Lock className="w-4 h-4" />
                          <span>版本 v{selectedContract.currentVersion} 已锁定</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    selectedContract.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {selectedContract.status === "approved" ? "已审批" : "审批中"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(selectedContract.data).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-accent rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {selectedContract.content && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">合同内容</h4>
                    {isPendingMyApproval && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSelecting(!isSelecting)}
                        className={isSelecting ? "bg-orange-50 border-orange-300" : ""}
                      >
                        <Highlighter className="w-4 h-4 mr-2" />
                        {isSelecting ? "批注模式已开启" : "开启批注"}
                      </Button>
                    )}
                  </div>

                  {isSelecting && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-orange-900 mb-2">
                        <strong>批注模式：</strong>在下方合同内容中选中文字，然后添加批注意见
                      </p>
                    </div>
                  )}

                  <div
                    className="bg-white border border-border rounded-lg p-6 max-h-[calc(100vh-400px)] overflow-y-auto"
                    onMouseUp={isSelecting ? handleTextSelection : undefined}
                  >
                    <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {selectedContract.content}
                    </pre>
                  </div>

                  {selectedText && isSelecting && (
                    <Card className="p-4 mt-4 border-2 border-orange-300">
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">已选中文本：</p>
                        <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">{selectedText}</div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">批注类型</label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={annotationType === "error" ? "default" : "outline"}
                            onClick={() => setAnnotationType("error")}
                            className={annotationType === "error" ? "bg-red-600" : ""}
                          >
                            必改项
                          </Button>
                          <Button
                            size="sm"
                            variant={annotationType === "warning" ? "default" : "outline"}
                            onClick={() => setAnnotationType("warning")}
                            className={annotationType === "warning" ? "bg-orange-600" : ""}
                          >
                            建议修改
                          </Button>
                          <Button
                            size="sm"
                            variant={annotationType === "suggestion" ? "default" : "outline"}
                            onClick={() => setAnnotationType("suggestion")}
                          >
                            提醒
                          </Button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-2">批注意见</label>
                        <textarea
                          value={annotationComment}
                          onChange={(e) => setAnnotationComment(e.target.value)}
                          className="w-full h-20 px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                          placeholder="请输入批注意见..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleAddAnnotation} size="sm" disabled={!annotationComment}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          添加批注
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsSelecting(false)
                            setSelectedText("")
                            setAnnotationComment("")
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </Card>

            {/* 批注列表 */}
            {annotations.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-balance">已添加的批注</h4>
                  <span className="ml-auto px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-medium">
                    {annotations.length} 条
                  </span>
                </div>

                <div className="space-y-3">
                  {annotations.map((annotation, index) => (
                    <div key={annotation.id} className="bg-accent rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-orange-700">#{index + 1}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              annotation.type === "error"
                                ? "bg-red-100 text-red-700"
                                : annotation.type === "warning"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {annotation.type === "error" ? "必改" : annotation.type === "warning" ? "建议" : "提醒"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAnnotations(annotations.filter((a) => a.id !== annotation.id))}
                          className="h-6 px-2 text-xs"
                        >
                          删除
                        </Button>
                      </div>

                      <div className="mb-2 bg-orange-50 rounded p-2 text-sm font-mono border border-orange-200">
                        {annotation.selectedText}
                      </div>

                      <p className="text-sm">{annotation.comment}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 审批操作 */}
            {isPendingMyApproval && (
              <Card className="p-6">
                <h4 className="font-semibold text-balance mb-4">审批意见</h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-24 px-4 py-3 rounded-lg border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none mb-4"
                  placeholder="请输入审批意见（可选）..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleApproveWithAnnotations}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    通过{annotations.length > 0 && `（含${annotations.length}条批注）`}
                  </Button>
                  <Button onClick={() => setShowDelegateForm(true)} variant="outline">
                    转派
                  </Button>
                  <Button onClick={() => setShowCountersignForm(true)} variant="outline">
                    加签
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    驳回{annotations.length > 0 && `（含${annotations.length}条批注）`}
                  </Button>
                </div>
              </Card>
            )}

            {/* 转派表单 */}
            {showDelegateForm && (
              <Card className="p-6 border-blue-300">
                <h5 className="font-medium mb-4">转派审批</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">选择转派人员</label>
                  <select
                    value={delegateTo}
                    onChange={(e) => setDelegateTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">请选择</option>
                    <option value="王经理">王经理</option>
                    <option value="赵总监">赵总监</option>
                    <option value="张主任">张主任</option>
                    <option value="刘主管">刘主管</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDelegate} disabled={!delegateTo}>
                    确认转派
                  </Button>
                  <Button variant="ghost" onClick={() => {setShowDelegateForm(false); setDelegateTo("")}}>
                    取消
                  </Button>
                </div>
              </Card>
            )}

            {/* 加签表单 */}
            {showCountersignForm && (
              <Card className="p-6 border-purple-300">
                <h5 className="font-medium mb-4">加签审批</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">选择加签人员</label>
                  <select
                    value={countersignTo}
                    onChange={(e) => setCountersignTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">请选择</option>
                    <option value="王经理">王经理</option>
                    <option value="赵总监">赵总监</option>
                    <option value="张主任">张主任</option>
                    <option value="刘主管">刘主管</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCountersign} disabled={!countersignTo}>
                    确认加签
                  </Button>
                  <Button variant="ghost" onClick={() => {setShowCountersignForm(false); setCountersignTo("")}}>
                    取消
                  </Button>
                </div>
              </Card>
            )}

            {selectedContract.status === "approved" && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-balance mb-2 text-lg">合同已全部审批通过</h4>
                  <p className="text-sm text-muted-foreground mb-6">请进行电子盖章完成合同签署流程</p>
                  <Button onClick={() => setShowStampPage(true)} size="lg" className="bg-primary">
                    进入盖章页面
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* 右侧：审批流程和历史记录（占1列） */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-balance">审批流程</h4>
              </div>

              {selectedContract.approvalFlow && (
                <div className="space-y-4 mb-6">
                  {selectedContract.approvalFlow.map((step: any, index: number) => (
                    <div
                      key={index}
                      className={`relative pl-6 pb-4 ${index < selectedContract.approvalFlow.length - 1 ? "border-l-2" : ""} ${
                        step.status === "approved"
                          ? "border-green-500"
                          : step.status === "pending"
                            ? "border-orange-500"
                            : step.status === "rejected"
                              ? "border-red-500"
                              : "border-border"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 w-6 h-6 rounded-full -translate-x-[13px] flex items-center justify-center text-white text-xs font-bold ${
                          step.status === "approved"
                            ? "bg-green-600"
                            : step.status === "pending"
                              ? "bg-orange-600"
                              : step.status === "rejected"
                                ? "bg-red-600"
                                : "bg-gray-300"
                        }`}
                      >
                        {step.status === "approved" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : step.status === "rejected" ? (
                          <XCircle className="w-4 h-4" />
                        ) : step.status === "pending" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          step.step
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{step.role}</span>
                          {step.isCountersign && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              会签
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <User className="w-3 h-3" />
                          <span>{step.name}</span>
                        </div>

                        {step.status !== "waiting" && step.timestamp && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(step.timestamp).toLocaleString("zh-CN")}</span>
                          </div>
                        )}

                        {step.comment && (
                          <div className="mt-2 bg-accent rounded p-2 text-xs">
                            <span className="font-medium">意见：</span>
                            {step.comment}
                          </div>
                        )}

                        {step.annotations && step.annotations.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <MessageSquare className="w-3 h-3 text-orange-600" />
                            <span className="text-orange-600">包含 {step.annotations.length} 条批注</span>
                          </div>
                        )}

                        {step.status === "waiting" && <span className="text-xs text-muted-foreground">等待中...</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedContract.approvalHistory && selectedContract.approvalHistory.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    操作记录
                  </h5>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedContract.approvalHistory.map((record: any, index: number) => (
                      <div key={index} className="bg-accent rounded-lg p-3 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{record.operator}</span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">{record.role}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              record.action === "approve"
                                ? "bg-green-100 text-green-700"
                                : record.action === "reject"
                                  ? "bg-red-100 text-red-700"
                                  : record.action === "delegate"
                                    ? "bg-blue-100 text-blue-700"
                                    : record.action === "countersign"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {record.action === "approve"
                              ? "通过"
                              : record.action === "reject"
                                ? "驳回"
                                : record.action === "delegate"
                                  ? "转派"
                                  : record.action === "countersign"
                                    ? "加签"
                                    : "提交"}
                          </span>
                        </div>

                        {record.comment && <p className="text-muted-foreground mb-2">{record.comment}</p>}

                        {record.annotations && record.annotations.length > 0 && (
                          <div className="flex items-center gap-1 text-orange-600 mb-2">
                            <MessageSquare className="w-3 h-3" />
                            <span>{record.annotations.length} 条批注</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(record.timestamp).toLocaleString("zh-CN")}</span>
                          <span>•</span>
                          <span>v{record.version}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-balance mb-1">审批流程</h2>
        <p className="text-muted-foreground">查看和处理待审批的合同</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">待审批</p>
              <p className="text-3xl font-bold text-orange-600">{pendingContracts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">已审批</p>
              <p className="text-3xl font-bold text-green-600">{approvedContracts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">已盖章</p>
              <p className="text-3xl font-bold text-primary">
                {contracts.filter((c: any) => c.status === "stamped").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* 待审批列表 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-balance mb-4">待审批合同</h3>
        {pendingContracts.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">暂无待审批合同</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingContracts.map((contract: any) => {
              const currentStep = contract.approvalFlow?.findIndex((step: any) => step.status === "pending") ?? -1
              const currentApprover = contract.approvalFlow?.[currentStep]

              return (
                <Card
                  key={contract.id}
                  className="p-6 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedContract(contract)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-balance mb-1">{contract.type}</h4>
                        <p className="text-sm text-muted-foreground">ID: {contract.id}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium">待审批</div>
                  </div>

                  {currentApprover && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-orange-600 mb-1">当前审批节点</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-700" />
                        <span className="text-sm font-medium text-orange-900">
                          {currentApprover.role} - {currentApprover.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {Object.entries(contract.data)
                      .slice(0, 2)
                      .map(([key, value]: [string, any]) => (
                        <div key={key} className="text-sm">
                          <span className="text-muted-foreground">{key}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* 已审批列表 */}
      <div>
        <h3 className="text-lg font-semibold text-balance mb-4">已审批合同</h3>
        {approvedContracts.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">暂无已审批合同</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedContracts.map((contract: any) => (
              <Card
                key={contract.id}
                className="p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedContract(contract)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-balance mb-1">{contract.type}</h4>
                      <p className="text-sm text-muted-foreground">ID: {contract.id}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">已审批</div>
                </div>

                <div className="space-y-2 mb-4">
                  {Object.entries(contract.data)
                    .slice(0, 2)
                    .map(([key, value]: [string, any]) => (
                      <div key={key} className="text-sm">
                        <span className="text-muted-foreground">{key}: </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedContract(contract)
                    setShowStampPage(true)
                  }}
                >
                  进入盖章
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

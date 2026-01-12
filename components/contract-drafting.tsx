"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  ArrowLeft,
  Eye,
  MessageSquare,
  XCircle,
  Clock,
} from "lucide-react"

const MOCK_CONTRACT_CONTENT = `算网数智收入合同

合同编号：CT2024XXXX

甲方（服务方）：中国联通算网数智科技有限公司
地址：北京市西城区金融大街21号
法定代表人：张某某
联系电话：010-12345678

乙方（客户方）：_______________
地址：_______________
法定代表人：_______________
联系电话：_______________

根据《中华人民共和国合同法》及相关法律法规的规定，甲乙双方本着平等自愿、诚实信用的原则，就算网数智服务项目事宜，经友好协商，达成如下协议：

第一条 合同标的
1.1 甲方向乙方提供算网数智云计算服务，包括但不限于云主机、云存储、云网络等服务。
1.2 服务内容详见附件《服务清单》。

第二条 合同金额与支付方式
2.1 本合同总金额为人民币_______________元整（¥_______________）。
2.2 付款方式：
    (1) 合同签订后5个工作日内，乙方向甲方支付合同总额的30%作为预付款；
    (2) 服务上线运行后，乙方向甲方支付合同总额的60%；
    (3) 项目验收合格后，乙方向甲方支付合同总额的10%作为尾款。
2.3 甲方开户银行及账号：
    开户银行：中国工商银行北京金融街支行
    账号：0200001234567890123

第三条 履行期限与地点
3.1 服务期限：自_______________年___月___日至_______________年___月___日。
3.2 服务地点：_______________。
3.3 服务上线时间：合同签订后_______________个工作日内。

第四条 质量标准与验收
4.1 甲方提供的服务应符合国家及行业相关标准。
4.2 服务可用性保证：月度可用性不低于99.9%。
4.3 验收标准：按照《服务验收标准》（附件2）执行。
4.4 验收期限：服务上线运行后_______________个工作日内完成验收。

第五条 知识产权
5.1 甲方提供的软件、技术方案等知识产权归甲方所有。
5.2 乙方在合同期限内享有服务使用权，但不得转让、出租或以其他方式让第三方使用。

第六条 保密条款
6.1 双方应对在合同履行过程中获知的对方商业秘密、技术秘密承担保密义务。
6.2 保密期限：自获知保密信息之日起至该信息公开之日止，但最短不少于5年。
6.3 违反保密义务的一方应赔偿对方因此遭受的全部损失。

第七条 违约责任
7.1 任何一方违反合同约定，应向守约方支付违约金，违约金为合同总额的10%。
7.2 因违约造成对方损失超过违约金的，违约方应赔偿全部损失。
7.3 甲方延迟提供服务的，每延迟一日，应按合同总额的0.5%向乙方支付违约金。
7.4 乙方延迟付款的，每延迟一日，应按逾期款项的0.05%向甲方支付滞纳金。

第八条 不可抗力
8.1 因不可抗力导致合同无法履行的，遭受不可抗力的一方应及时通知对方，并提供相关证明。
8.2 因不可抗力导致合同部分无法履行的，双方应协商变更合同内容或解除合同。

第九条 争议解决
9.1 本合同履行过程中发生的争议，双方应友好协商解决。
9.2 协商不成的，任何一方均可向甲方所在地人民法院提起诉讼。

第十条 其他约定
10.1 本合同自双方盖章之日起生效。
10.2 本合同一式肆份，甲乙双方各执贰份，具有同等法律效力。
10.3 本合同未尽事宜，双方可另行签订补充协议，补充协议与本合同具有同等法律效力。

附件清单：
1. 《服务清单》
2. 《服务验收标准》
3. 《服务等级协议（SLA）》


甲方（盖章）：                          乙方（盖章）：

法定代表人或授权代表：                  法定代表人或授权代表：

签字日期：    年    月    日            签字日期：    年    月    日`

export function ContractDrafting({ contracts, setContracts, onNavigate }: any) {
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewContent, setPreviewContent] = useState("")
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<any>(null)
  // const [showAnnotations, setShowAnnotations] = useState(false) // This state was not used and can be removed.

  const draftContracts = contracts.filter(
    (c: any) => c.status === "draft" || c.status === "rejected" || c.status === "revision_needed",
  )

  const handleDownloadTemplate = () => {
    let templateContent = MOCK_CONTRACT_CONTENT

    // 替换合同中的占位符
    Object.entries(selectedContract.data).forEach(([key, value]: [string, any]) => {
      // Use a more robust regex to avoid replacing unintended parts if keys are substrings of others.
      // For this specific mock, the simple replacement works, but in a real scenario, more care is needed.
      templateContent = templateContent.replace(
        new RegExp(`(?<!\\w)${key}(?!\\w)|(?<!\\w)_______________(?=.*${key})(?!\\w)`, "g"),
        value,
      )
    })

    const blob = new Blob([templateContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    // Use scenario instead of type for filename
    a.download = `${selectedContract.scenario}_${selectedContract.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // This is a simplified mock, in a real app you'd read the file content.
      const mockContent = MOCK_CONTRACT_CONTENT.replace(/_______________/g, (match, offset) => {
        const keys = Object.keys(selectedContract.data)
        const values = Object.values(selectedContract.data)
        // Select a random value for each placeholder, or a specific one if the placeholder is more specific.
        // For simplicity, we'll just pick a random one.
        const index = Math.floor(Math.random() * keys.length)
        return values[index] as string
      })
      setPreviewContent(mockContent)
    }
  }

  const handleAIReview = async () => {
    setIsReviewing(true)
    setReviewResult(null)

    await new Promise((resolve) => setTimeout(resolve, 4000))

    const hasViolation = Math.random() > 0.7 // 30%概率触发违规

    if (hasViolation) {
      const mockReview = {
        score: 45,
        status: "rejected",
        violationDetected: true, // Added this flag for easier UI handling
        issues: [
          {
            type: "error",
            title: "触发违规条款",
            description: "合同中存在不符合公司规定的条款，根据风控要求自动驳回",
            location: "第七条第3款",
            severity: "critical",
            detail: "违约金比例超过公司规定的最高限额（0.5%），存在重大风险",
          },
          {
            type: "error",
            title: "金额超过审批权限",
            description: "合同金额超过当前审批流程的授权额度",
            location: "第二条",
            severity: "critical",
            detail: "合同总金额需在500万元以下才能走此审批流程",
          },
        ],
        compliance: {
          legal: false,
          format: true,
          completeness: 0.65,
        },
      }

      setReviewResult(mockReview)
      setIsReviewing(false)

      // 自动驳回到起草状态
      setTimeout(() => {
        alert("检测到违规条款，合同已自动驳回至起草状态，请修改后重新提交")
        setContracts(
          contracts.map((c: any) =>
            c.id === selectedContract.id
              ? {
                  ...c,
                  status: "rejected",
                  aiReviewStatus: "rejected", // Added for tracking AI review status
                  aiReviewResult: mockReview,
                  rejectedAt: new Date().toISOString(),
                  rejectionReason: "AI预审发现违规条款，自动驳回",
                }
              : c,
          ),
        )
        setSelectedContract(null)
        setUploadedFile(null) // Reset file upload state
        setPreviewContent("") // Reset preview content
      }, 2000)

      return
    }

    // 正常通过的情况
    const mockReview = {
      score: 88,
      status: "pass",
      violationDetected: false, // Added this flag
      issues: [
        {
          type: "warning",
          title: "付款条款建议更明确",
          description: "建议在付款条款中明确具体的付款时间节点",
          location: "第二条第2款",
          severity: "medium",
          detail: '当前付款时间描述为"5个工作日内"，建议明确为具体日期',
        },
        {
          type: "warning",
          title: "知识产权条款需关注",
          description: "知识产权归属约定可能存在争议风险",
          location: "第五条",
          severity: "medium",
          detail: "建议明确项目定制开发内容的知识产权归属",
        },
        {
          type: "suggestion",
          title: "违约责任可以更详细",
          description: "建议增加具体的违约赔偿计算方式和上限",
          location: "第七条",
          severity: "low",
          detail: "当前违约金比例合理，但可以增加赔偿上限条款",
        },
        {
          type: "pass",
          title: "合同主体信息完整",
          description: "甲乙双方信息齐全，符合法律要求",
          location: "合同抬头",
          severity: "none",
        },
        {
          type: "pass",
          title: "保密条款规范",
          description: "保密义务和期限约定清晰，符合行业标准",
          location: "第六条",
          severity: "none",
        },
      ],
      compliance: {
        legal: true,
        format: true,
        completeness: 0.88,
      },
    }

    setReviewResult(mockReview)
    setIsReviewing(false)

    // 更新合同状态为已审核
    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              aiReviewStatus: "reviewed", // Added for tracking
              aiReviewResult: mockReview,
            }
          : c,
      ),
    )
  }

  const handleSubmitForApproval = () => {
    if (!previewContent) {
      alert("请先上传合同文件")
      return
    }

    // Add check for reviewResult.status to ensure it's 'pass'
    if (!reviewResult || reviewResult.status !== "pass") {
      alert("请先进行AI预审并通过后再提交")
      return
    }

    const newVersion = selectedContract.currentVersion + 1
    const version = {
      versionNumber: newVersion,
      content: previewContent,
      fileName: uploadedFile?.name || "合同文件.txt", // Provide a default filename
      data: selectedContract.data,
      createdAt: new Date().toISOString(),
      createdBy: "张三",
      locked: true,
      reviewResult: reviewResult,
    }

    const approvalFlow = [
      { step: 1, role: "部门经理", name: "李经理", status: "pending" },
      { step: 2, role: "法务", name: "王律师", status: "waiting", isCountersign: true },
      { step: 3, role: "财务", name: "赵会计", status: "waiting", isCountersign: true },
      { step: 4, role: "总经理", name: "刘总", status: "waiting" },
    ]

    setContracts(
      contracts.map((c: any) =>
        c.id === selectedContract.id
          ? {
              ...c,
              status: "pending_approval",
              content: previewContent,
              currentVersion: newVersion,
              versions: [...(c.versions || []), version],
              approvalFlow: approvalFlow,
              approvalHistory: [
                ...(c.approvalHistory || []),
                {
                  action: "submit",
                  operator: "张三",
                  role: "发起人",
                  timestamp: new Date().toISOString(),
                  comment: "提交审批",
                  version: newVersion,
                },
              ],
            }
          : c,
      ),
    )
    setSelectedContract(null)
    setUploadedFile(null)
    setPreviewContent("")
    setReviewResult(null)

    if (onNavigate) onNavigate("approval")
  }

  if (selectedContract) {
    const hasAnnotations = selectedContract.annotations && selectedContract.annotations.length > 0

    return (
      // 调整最大宽度以适应左右分栏布局
      <div className="max-w-[1600px] mx-auto">
        <Button variant="ghost" onClick={() => setSelectedContract(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：合同预览 */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-balance">合同预览</h4>
                {previewContent && (
                  <span className="ml-auto text-xs text-muted-foreground">{uploadedFile?.name || "合同文件"}</span>
                )}
              </div>
              {previewContent ? (
                // 优化预览区域样式
                <div className="bg-white border border-border rounded-lg p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{previewContent}</pre>
                </div>
              ) : (
                // 优化无预览内容时的展示
                <div className="bg-accent rounded-lg p-12 text-center border-2 border-dashed border-border">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">上传合同文件后将在此处预览</p>
                </div>
              )}
            </Card>

            {/* 批注列表（如果有） */}
            {hasAnnotations && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-balance">审批批注</h3>
                  <span className="ml-auto px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-medium">
                    {selectedContract.annotations.length} 条
                  </span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedContract.annotations.map((annotation: any, index: number) => (
                    <div key={index} className="bg-accent rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-orange-700">#{index + 1}</span>
                          <span className="text-xs text-muted-foreground">{annotation.location}</span>
                        </div>
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

                      <div className="mb-2 bg-orange-50 rounded p-2 text-sm font-mono border border-orange-200">
                        {annotation.selectedText}
                      </div>

                      <p className="text-sm mb-2">{annotation.comment}</p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <span>{annotation.reviewer}</span>
                        <span>•</span>
                        <span>{new Date(annotation.timestamp).toLocaleString("zh-CN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 右侧：操作区域和AI审批 */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  {/* Use scenario instead of type */}
                  <h3 className="font-semibold text-balance">{selectedContract.scenario}</h3>
                  <p className="text-sm text-muted-foreground">合同编号: {selectedContract.id}</p>
                </div>
                {selectedContract.status === "rejected" && (
                  <div className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    已驳回
                  </div>
                )}
                {selectedContract.status === "revision_needed" && (
                  <div className="ml-auto px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    需要修改
                  </div>
                )}
              </div>

              {/* 合同基本信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">基本信息</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedContract.data).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-accent rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">{key}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作步骤 */}
              <div className="space-y-4">
                {/* 步骤1: 下载模板 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        {/* Use scenario instead of type */}
                        <h4 className="font-semibold text-sm">下载合同{hasAnnotations ? "当前版本" : "模板"}</h4>
                      </div>
                      <p className="text-xs text-blue-700 ml-8">
                        {hasAnnotations
                          ? "下载包含批注内容的当前版本合同，在本地进行修改"
                          : "下载系统生成的合同模板，使用Word或其他编辑器进行编辑"}
                      </p>
                    </div>
                    <Button onClick={handleDownloadTemplate} size="sm" className="ml-4 flex-shrink-0">
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </div>

                {/* 步骤2: 上传文件 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-sm">上传编辑后的合同</h4>
                  </div>
                  <div className="ml-8">
                    <p className="text-xs text-green-700 mb-3">在本地编辑完成后，上传合同文件进行预览和AI审核</p>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 hover:border-green-400 transition-colors bg-white">
                      <input
                        type="file"
                        accept=".txt,.doc,.docx,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="contract-upload"
                      />
                      <label htmlFor="contract-upload" className="cursor-pointer block">
                        <div className="flex items-center gap-3">
                          {uploadedFile ? (
                            <>
                              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-green-700 font-medium truncate">{uploadedFile.name}</p>
                                <p className="text-xs text-green-600">文件已上传，点击可重新选择</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-green-600 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-green-700 font-medium">点击上传或拖拽文件到此处</p>
                                <p className="text-xs text-green-600">支持 TXT、Word、PDF 格式</p>
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 步骤3: AI预审 */}
                {previewContent && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                            3
                          </div>
                          <h4 className="font-semibold text-sm">AI智能预审</h4>
                          {isReviewing && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-spin" />
                              审核中
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-700 ml-8">
                          使用AI技术分析合同条款的合规性、完整性和潜在风险，异步处理约需3-5秒
                        </p>
                      </div>
                      <Button
                        onClick={handleAIReview}
                        // Disable button if already passed review or is reviewing
                        disabled={isReviewing || (reviewResult && reviewResult.status === "pass")}
                        size="sm"
                        className="ml-4 bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                      >
                        {isReviewing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            预审中...
                          </>
                        ) : reviewResult && reviewResult.status === "pass" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            已通过
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI预审
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* AI预审结果 */}
            {reviewResult && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        reviewResult.violationDetected
                          ? "bg-gradient-to-br from-red-500 to-orange-500"
                          : "bg-gradient-to-br from-purple-500 to-blue-500"
                      }`}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-balance">AI预审报告</h4>
                      <p className="text-sm text-muted-foreground">综合评分: {reviewResult.score}分</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-medium ${
                      reviewResult.violationDetected
                        ? "bg-red-100 text-red-700"
                        : reviewResult.score >= 80
                          ? "bg-green-100 text-green-700"
                          : reviewResult.score >= 60
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {reviewResult.violationDetected
                      ? "触发违规"
                      : reviewResult.score >= 80
                        ? "通过"
                        : reviewResult.score >= 60
                          ? "待改进"
                          : "需修改"}
                  </div>
                </div>

                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      reviewResult.violationDetected
                        ? "bg-red-500"
                        : reviewResult.score >= 80
                          ? "bg-green-500"
                          : reviewResult.score >= 60
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${reviewResult.score}%` }}
                  />
                </div>

                {/* Display violation message prominently */}
                {reviewResult.violationDetected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900 mb-1">检测到违规条款</p>
                        <p className="text-sm text-red-700">
                          根据公司风控规定，合同将自动驳回至起草状态，请修改后重新提交
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">法律合规</p>
                    <div className="flex items-center justify-center gap-1">
                      {reviewResult.compliance.legal ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">通过</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-600">未通过</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">格式规范</p>
                    <div className="flex items-center justify-center gap-1">
                      {reviewResult.compliance.format ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">通过</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-600">未通过</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">完整度</p>
                    <span className="font-semibold text-lg">
                      {(reviewResult.compliance.completeness * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviewResult.issues.map((issue: any, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 border-l-4 ${
                        issue.type === "error"
                          ? "bg-red-50 border-red-500"
                          : issue.type === "warning"
                            ? "bg-orange-50 border-orange-500"
                            : issue.type === "suggestion"
                              ? "bg-blue-50 border-blue-500"
                              : "bg-green-50 border-green-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {issue.type === "error" && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                        {issue.type === "warning" && (
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        )}
                        {issue.type === "suggestion" && (
                          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        {issue.type === "pass" && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="font-medium text-sm">{issue.title}</h5>
                            <span className="text-xs text-muted-foreground ml-2">{issue.location}</span>
                          </div>
                          <p className="text-sm mb-1">{issue.description}</p>
                          {issue.detail && <p className="text-xs text-muted-foreground">{issue.detail}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 提交审批按钮 */}
            {/* Only show submit button if review passed and no violations */}
            {reviewResult && reviewResult.status === "pass" && !reviewResult.violationDetected && (
              <Button onClick={handleSubmitForApproval} className="w-full h-12 text-base" size="lg">
                <Send className="w-5 h-5 mr-2" />
                提交审批
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-balance mb-1">合同起草</h2>
        <p className="text-muted-foreground">下载模板、编辑合同并提交AI预审</p>
      </div>

      {draftContracts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-balance mb-2">暂无待起草合同</h3>
          <p className="text-muted-foreground mb-6">请先在"新建合同"页面创建合同</p>
          <Button onClick={() => onNavigate && onNavigate("new")}>
            <FileText className="w-4 h-4 mr-2" />
            新建合同
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {draftContracts.map((contract: any) => (
            <Card
              key={contract.id}
              className="p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedContract(contract)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    contract.status === "rejected"
                      ? "bg-red-600"
                      : contract.status === "revision_needed"
                        ? "bg-orange-600"
                        : "bg-primary"
                  }`}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Use scenario instead of type */}
                  <h3 className="font-semibold text-balance mb-1">{contract.scenario}</h3>
                  <p className="text-sm text-muted-foreground">ID: {contract.id}</p>
                </div>
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

              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-center ${
                    contract.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : contract.status === "revision_needed"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {contract.status === "rejected"
                    ? "已驳回"
                    : contract.status === "revision_needed"
                      ? "需修改"
                      : "待起草"}
                </div>
                {contract.annotations && contract.annotations.length > 0 && (
                  <div className="px-2 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-medium flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {contract.annotations.length}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

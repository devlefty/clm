"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Edit3, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

export function ContractTodos({ contracts, setContracts, onNavigate }: any) {
  // 计算待办项
  const needReview = contracts.filter((c: any) => c.status === "draft" && !c.aiReviewStatus)
  const needSubmit = contracts.filter((c: any) => c.status === "draft" && c.aiReviewStatus === "reviewed")
  const needApproval = contracts.filter((c: any) => c.status === "pending_approval")
  const needStamp = contracts.filter((c: any) => c.status === "approved")
  const needModify = contracts.filter((c: any) => c.status === "rejected")

  const todoSections = [
    {
      title: "待起草",
      count: needReview.length,
      icon: Edit3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      contracts: needReview,
      action: "继续起草",
      navigateTo: "draft",
    },
    {
      title: "待提交审批",
      count: needSubmit.length,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      contracts: needSubmit,
      action: "提交审批",
      navigateTo: "draft",
    },
    {
      title: "待我审批",
      count: needApproval.length,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      contracts: needApproval,
      action: "立即审批",
      navigateTo: "approval",
    },
    {
      title: "待盖章",
      count: needStamp.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      contracts: needStamp,
      action: "立即盖章",
      navigateTo: "approval",
    },
    {
      title: "被驳回需修改",
      count: needModify.length,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      contracts: needModify,
      action: "查看原因",
      navigateTo: "draft",
    },
  ]

  const totalTodos = needReview.length + needSubmit.length + needApproval.length + needStamp.length + needModify.length

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-balance mb-1">我的待办</h2>
        <p className="text-muted-foreground">
          你有 <span className="font-semibold text-foreground">{totalTodos}</span> 项待办事项需要处理
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {todoSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <span className={`text-2xl font-bold ${section.color}`}>{section.count}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{section.title}</p>
            </Card>
          )
        })}
      </div>

      {/* 详细待办列表 */}
      <div className="space-y-6">
        {todoSections.map(
          (section) =>
            section.count > 0 && (
              <div key={section.title}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-balance flex items-center gap-2">
                    <div className={`w-1 h-5 rounded ${section.bgColor}`} />
                    {section.title}
                    <span className="text-muted-foreground text-sm font-normal">({section.count})</span>
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate(section.navigateTo)}>
                    查看全部
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.contracts.slice(0, 3).map((contract: any) => (
                    <Card key={contract.id} className="p-4 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <FileText className={`w-5 h-5 ${section.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-balance mb-1 truncate">{contract.type}</h4>
                          <p className="text-xs text-muted-foreground">ID: {contract.id}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {Object.entries(contract.data)
                          .slice(0, 2)
                          .map(([key, value]: [string, any]) => (
                            <div key={key} className="text-sm">
                              <span className="text-muted-foreground">{key}: </span>
                              <span className="font-medium truncate">{value}</span>
                            </div>
                          ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(contract.createdAt).toLocaleDateString("zh-CN")}</span>
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        variant={section.title === "被驳回需修改" ? "destructive" : "default"}
                        onClick={() => onNavigate(section.navigateTo)}
                      >
                        {section.action}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ),
        )}

        {totalTodos === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-balance mb-2">太棒了！暂无待办事项</h3>
            <p className="text-muted-foreground mb-6">所有合同都已处理完毕</p>
            <Button onClick={() => onNavigate("new")}>
              <FileText className="w-4 h-4 mr-2" />
              新建合同
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

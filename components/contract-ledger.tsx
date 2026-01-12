"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Stamp,
} from "lucide-react"

export function ContractLedger({ contracts }: any) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [sortBy, setSortBy] = useState<"date" | "type" | "status">("date")

  const statusMap = {
    draft: { label: "草稿", color: "bg-[#E5E7EB] text-[#6B7280]", icon: FileText },
    pending_approval: { label: "待审批", color: "bg-[#FEF3C7] text-[#D97706]", icon: Clock },
    approved: { label: "已审批", color: "bg-[#D1FAE5] text-[#059669]", icon: CheckCircle2 },
    rejected: { label: "已驳回", color: "bg-[#FEE2E2] text-[#DC2626]", icon: XCircle },
    stamped: { label: "已盖章", color: "bg-[#EEF2FF] text-[#4F46E5]", icon: Stamp },
  }

  const filteredContracts = contracts
    .filter((c: any) => {
      const matchesSearch =
        c.type?.includes(searchTerm) ||
        c.id.includes(searchTerm) ||
        Object.values(c.data).some((v: any) => String(v).includes(searchTerm))
      const matchesStatus = selectedStatus === "all" || c.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    .sort((a: any, b: any) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type)
      } else {
        return a.status.localeCompare(b.status)
      }
    })

  const handleExportCSV = () => {
    const headers = ["合同编号", "合同类型", "状态", "创建时间"]
    const rows = filteredContracts.map((c: any) => [
      c.id,
      c.type,
      statusMap[c.status as keyof typeof statusMap]?.label || c.status,
      new Date(c.createdAt).toLocaleString("zh-CN"),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `合同台账_${new Date().toLocaleDateString("zh-CN")}.csv`
    link.click()
  }

  const handleExportPDF = () => {
    alert("PDF导出功能：实际应用中会生成包含所有合同信息的PDF文档")
  }

  const stats = {
    total: contracts.length,
    draft: contracts.filter((c: any) => c.status === "draft").length,
    pending: contracts.filter((c: any) => c.status === "pending_approval").length,
    approved: contracts.filter((c: any) => c.status === "approved").length,
    stamped: contracts.filter((c: any) => c.status === "stamped").length,
  }

  if (selectedContract) {
    return (
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedContract(null)} className="mb-6">
          ← 返回台账
        </Button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-balance mb-2">{selectedContract.type}</h2>
                <p className="text-sm text-[#6B7280] mb-2">合同编号: {selectedContract.id}</p>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                    statusMap[selectedContract.status as keyof typeof statusMap]?.color
                  }`}
                >
                  {statusMap[selectedContract.status as keyof typeof statusMap]?.label}
                </div>
              </div>
            </div>
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
              <Download className="w-4 h-4 mr-2" />
              下载合同
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-balance mb-4">基本信息</h3>
              <div className="space-y-3">
                {Object.entries(selectedContract.data).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-[#F9FAFB] rounded-lg p-3">
                    <p className="text-sm text-[#6B7280] mb-1">{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-balance mb-4">流程信息</h3>
              <div className="space-y-3">
                <div className="bg-[#F9FAFB] rounded-lg p-3">
                  <p className="text-sm text-[#6B7280] mb-1">创建时间</p>
                  <p className="font-medium">{new Date(selectedContract.createdAt).toLocaleString("zh-CN")}</p>
                </div>
                {selectedContract.approvedAt && (
                  <div className="bg-[#F9FAFB] rounded-lg p-3">
                    <p className="text-sm text-[#6B7280] mb-1">审批时间</p>
                    <p className="font-medium">{new Date(selectedContract.approvedAt).toLocaleString("zh-CN")}</p>
                  </div>
                )}
                {selectedContract.approvedBy && (
                  <div className="bg-[#F9FAFB] rounded-lg p-3">
                    <p className="text-sm text-[#6B7280] mb-1">审批人</p>
                    <p className="font-medium">{selectedContract.approvedBy}</p>
                  </div>
                )}
                {selectedContract.stampedAt && (
                  <div className="bg-[#F9FAFB] rounded-lg p-3">
                    <p className="text-sm text-[#6B7280] mb-1">盖章时间</p>
                    <p className="font-medium">{new Date(selectedContract.stampedAt).toLocaleString("zh-CN")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedContract.content && (
            <div>
              <h3 className="font-bold text-balance mb-4">合同内容</h3>
              <div className="bg-[#F9FAFB] rounded-lg p-6 max-h-[400px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">{selectedContract.content}</pre>
              </div>
            </div>
          )}

          {selectedContract.reviewResult && (
            <div className="mt-6">
              <h3 className="font-bold text-balance mb-4">AI预审结果</h3>
              <div className="bg-[#F0F9FF] border border-[#06B6D4]/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-[#06B6D4]" />
                  <span className="font-medium">综合评分: {selectedContract.reviewResult.score}分</span>
                </div>
                <div className="space-y-2">
                  {selectedContract.reviewResult.issues.slice(0, 2).map((issue: any, index: number) => (
                    <p key={index} className="text-sm text-[#0284C7]">
                      • {issue.title}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-balance mb-2">合同台账</h2>
        <p className="text-[#6B7280]">查看所有合同记录并导出数据</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6B7280]">合同总数</p>
            <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6B7280]">草稿</p>
            <FileText className="w-5 h-5 text-[#6B7280]" />
          </div>
          <p className="text-2xl font-bold text-[#6B7280]">{stats.draft}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6B7280]">待审批</p>
            <Clock className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <p className="text-2xl font-bold text-[#F59E0B]">{stats.pending}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6B7280]">已审批</p>
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <p className="text-2xl font-bold text-[#10B981]">{stats.approved}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#6B7280]">已盖章</p>
            <Stamp className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <p className="text-2xl font-bold text-[#4F46E5]">{stats.stamped}</p>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索合同编号、类型或内容..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all"
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="pending_approval">待审批</option>
              <option value="approved">已审批</option>
              <option value="rejected">已驳回</option>
              <option value="stamped">已盖章</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none transition-all"
            >
              <option value="date">按日期排序</option>
              <option value="type">按类型排序</option>
              <option value="status">按状态排序</option>
            </select>

            <Button onClick={handleExportCSV} variant="outline" className="whitespace-nowrap bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              导出CSV
            </Button>

            <Button onClick={handleExportPDF} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white whitespace-nowrap">
              <Download className="w-4 h-4 mr-2" />
              导出PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* 合同列表 */}
      {filteredContracts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-[#9CA3AF]" />
          <h3 className="text-lg font-bold text-balance mb-2">没有找到合同</h3>
          <p className="text-[#6B7280]">尝试调整搜索条件或创建新合同</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">合同编号</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">合同类型</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">关键信息</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">创建时间</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6B7280]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredContracts.map((contract: any) => {
                  const StatusIcon = statusMap[contract.status as keyof typeof statusMap]?.icon || FileText
                  return (
                    <tr key={contract.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium">{contract.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{contract.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#6B7280]">
                          {Object.entries(contract.data)
                            .slice(0, 1)
                            .map(([key, value]: [string, any]) => (
                              <span key={key}>
                                {key}: {value}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                            statusMap[contract.status as keyof typeof statusMap]?.color
                          }`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMap[contract.status as keyof typeof statusMap]?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Calendar className="w-4 h-4" />
                          {new Date(contract.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedContract(contract)}
                          className="hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          查看
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

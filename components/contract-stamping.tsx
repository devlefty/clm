"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stamp, ArrowLeft, Shield, CheckCircle2, MapPin } from "lucide-react"

export function ContractStamping({ contract, onBack, onComplete }: any) {
  const [stampType, setStampType] = useState<"company" | "legal" | "financial">("company")
  const [stampPosition, setStampPosition] = useState({ page: 1, x: 50, y: 50 })
  const [selectedPages, setSelectedPages] = useState<number[]>([1])

  const stampTypes = [
    {
      id: "company",
      name: "公司公章",
      description: "适用于一般合同和协议",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      id: "legal",
      name: "合同专用章",
      description: "适用于重要合同签署",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "financial",
      name: "财务专用章",
      description: "适用于财务相关合同",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
  ]

  const handleStamp = () => {
    const stampedContract = {
      ...contract,
      status: "stamped",
      stampedAt: new Date().toISOString(),
      stampType: stampType,
      stampedBy: "李主管",
      stampInfo: {
        type: stampType,
        pages: selectedPages,
        position: stampPosition,
      },
    }
    onComplete(stampedContract)
  }

  const togglePage = (page: number) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page))
    } else {
      setSelectedPages([...selectedPages, page].sort((a, b) => a - b))
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：盖章设置 */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Stamp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-balance">电子盖章</h3>
                <p className="text-sm text-muted-foreground">配置印章参数</p>
              </div>
            </div>

            {/* 印章类型选择 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">选择印章类型</h4>
              <div className="space-y-2">
                {stampTypes.map((type: any) => (
                  <Card
                    key={type.id}
                    className={`p-4 cursor-pointer border-2 transition-all ${
                      stampType === type.id ? "border-primary bg-blue-50" : "hover:border-border"
                    }`}
                    onClick={() => setStampType(type.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Stamp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-balance">{type.name}</h5>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                      {stampType === type.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 页面选择 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">选择盖章页面</h4>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={selectedPages.includes(page) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePage(page)}
                    className="h-12"
                  >
                    P{page}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                已选择 {selectedPages.length} 个页面: {selectedPages.join(", ")}
              </p>
            </div>

            {/* 位置设置 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                盖章位置
              </h4>
              <div className="bg-accent rounded-lg p-4">
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground block mb-1">水平位置 (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stampPosition.x}
                    onChange={(e) => setStampPosition({ ...stampPosition, x: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-1">{stampPosition.x}%</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">垂直位置 (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stampPosition.y}
                    onChange={(e) => setStampPosition({ ...stampPosition, y: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-1">{stampPosition.y}%</p>
                </div>
              </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-900 mb-1">安全提示</p>
                  <p className="text-orange-700">
                    电子印章具有法律效力，加盖后将无法撤销，请确认合同内容无误后再进行盖章操作。
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleStamp} className="w-full" size="lg" disabled={selectedPages.length === 0}>
              <Stamp className="w-4 h-4 mr-2" />
              确认盖章
            </Button>
          </Card>
        </div>

        {/* 右侧：合同预览 */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-balance mb-1">合同预览</h3>
              <p className="text-sm text-muted-foreground">
                {contract.type} - {contract.id}
              </p>
            </div>

            {/* 模拟合同页面预览 */}
            <div className="space-y-4">
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className={`relative bg-white border-2 rounded-lg p-8 min-h-[400px] ${
                    selectedPages.includes(page) ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="absolute top-2 right-2 px-2 py-1 bg-accent rounded text-xs font-medium">
                    第 {page} 页
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-center mb-4">{contract.type}</h4>
                    <div className="space-y-2 text-sm">
                      <p>合同编号：{contract.id}</p>
                      {Object.entries(contract.data)
                        .slice(0, 3)
                        .map(([key, value]: [string, any]) => (
                          <p key={key}>
                            {key}：{value}
                          </p>
                        ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      根据《中华人民共和国合同法》及相关法律法规，甲乙双方在平等、自愿的基础上，就以下事项达成协议：
                    </p>
                    <p>一、合同标的</p>
                    <p>二、权利义务</p>
                    <p>三、付款方式</p>
                  </div>

                  {/* 印章预览 */}
                  {selectedPages.includes(page) && (
                    <div
                      className="absolute"
                      style={{
                        left: `${stampPosition.x}%`,
                        top: `${stampPosition.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${
                          stampTypes.find((t) => t.id === stampType)?.color
                        } opacity-50 flex items-center justify-center border-4 border-current`}
                      >
                        <div className="text-white text-xs font-bold text-center">
                          {stampTypes.find((t) => t.id === stampType)?.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

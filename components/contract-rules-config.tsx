"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus, Trash2, AlertTriangle, FileText, DollarSign, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type RuleCategory = "blacklist" | "clause" | "amount" | "general" | "finance" | "legal"

interface Rule {
  id: string
  name: string
  description: string
  category: RuleCategory
  enabled: boolean
  severity: "high" | "medium" | "low"
  config?: any
}

export function ContractRulesConfig() {
  const [rules, setRules] = useState<Rule[]>([
    // 黑名单规则
    {
      id: "bl-1",
      name: "甲方黑名单检查",
      description: "检查合同甲方是否在企业黑名单中",
      category: "blacklist",
      enabled: true,
      severity: "high",
      config: {
        blacklist: ["风险企业A有限公司", "失信企业B集团", "诉讼企业C"],
      },
    },
    {
      id: "bl-2",
      name: "乙方黑名单检查",
      description: "检查合同乙方是否在企业黑名单中",
      category: "blacklist",
      enabled: true,
      severity: "high",
      config: {
        blacklist: ["风险企业A有限公司", "失信企业B集团", "诉讼企业C"],
      },
    },

    // 条款规则
    {
      id: "cl-1",
      name: "霸王条款检测",
      description: "检测不平等条款，如单方面解除权、免责条款等",
      category: "clause",
      enabled: true,
      severity: "high",
    },
    {
      id: "cl-2",
      name: "付款条件合理性",
      description: "检查预付款比例、付款周期是否符合公司规定",
      category: "clause",
      enabled: true,
      severity: "medium",
      config: {
        maxAdvancePaymentRatio: 0.3,
        maxPaymentDays: 90,
      },
    },
    {
      id: "cl-3",
      name: "违约金比例检查",
      description: "检查违约金比例是否超过公司规定的上限",
      category: "clause",
      enabled: true,
      severity: "high",
      config: {
        maxDailyPenaltyRate: 0.005, // 0.5%
      },
    },
    {
      id: "cl-4",
      name: "争议解决条款",
      description: "检查仲裁或诉讼管辖地是否对公司有利",
      category: "clause",
      enabled: true,
      severity: "medium",
    },

    // 金额规则
    {
      id: "am-1",
      name: "合同金额上限检查",
      description: "检查合同金额是否超过当前审批流程授权额度",
      category: "amount",
      enabled: true,
      severity: "high",
      config: {
        maxAmount: 5000000, // 500万
      },
    },
    {
      id: "am-2",
      name: "异常低价预警",
      description: "检查合同价格是否明显低于市场价，存在不合理竞争",
      category: "amount",
      enabled: true,
      severity: "medium",
      config: {
        minPriceRatio: 0.7, // 低于市场价70%预警
      },
    },
    {
      id: "am-3",
      name: "异常高价预警",
      description: "检查合同价格是否明显高于市场价",
      category: "amount",
      enabled: true,
      severity: "medium",
      config: {
        maxPriceRatio: 1.5, // 高于市场价150%预警
      },
    },

    // 通用规则
    {
      id: "gn-1",
      name: "必填字段完整性",
      description: "检查合同必填字段是否完整填写",
      category: "general",
      enabled: true,
      severity: "high",
    },
    {
      id: "gn-2",
      name: "合同有效期检查",
      description: "检查合同期限是否合理，是否存在永久有效等异常情况",
      category: "general",
      enabled: true,
      severity: "medium",
    },
    {
      id: "gn-3",
      name: "附件完整性检查",
      description: "检查合同要求的附件是否已全部上传",
      category: "general",
      enabled: true,
      severity: "high",
    },
    {
      id: "gn-4",
      name: "合同编号规范性",
      description: "检查合同编号是否符合公司命名规则",
      category: "general",
      enabled: true,
      severity: "low",
    },

    // 财务规则
    {
      id: "fn-1",
      name: "发票条款检查",
      description: "检查发票开具时间、类型、税率等是否明确",
      category: "finance",
      enabled: true,
      severity: "high",
    },
    {
      id: "fn-2",
      name: "收款账户验证",
      description: "验证收款账户是否为公司对公账户",
      category: "finance",
      enabled: true,
      severity: "high",
    },
    {
      id: "fn-3",
      name: "税务合规检查",
      description: "检查合同税务条款是否符合税法规定",
      category: "finance",
      enabled: true,
      severity: "high",
    },
    {
      id: "fn-4",
      name: "成本核算合理性",
      description: "检查合同成本核算方式是否符合财务要求",
      category: "finance",
      enabled: true,
      severity: "medium",
    },
    {
      id: "fn-5",
      name: "预算占用检查",
      description: "检查合同金额是否超出部门预算",
      category: "finance",
      enabled: true,
      severity: "high",
      config: {
        checkBudget: true,
      },
    },

    // 法务规则
    {
      id: "lg-1",
      name: "知识产权条款",
      description: "检查知识产权归属、使用范围是否明确",
      category: "legal",
      enabled: true,
      severity: "high",
    },
    {
      id: "lg-2",
      name: "保密条款完整性",
      description: "检查保密范围、保密期限、违约责任是否完整",
      category: "legal",
      enabled: true,
      severity: "high",
    },
    {
      id: "lg-3",
      name: "法律适用检查",
      description: "检查适用法律和争议解决方式是否明确",
      category: "legal",
      enabled: true,
      severity: "medium",
    },
    {
      id: "lg-4",
      name: "合同主体资格",
      description: "检查合同主体是否具备相应的资质和能力",
      category: "legal",
      enabled: true,
      severity: "high",
    },
    {
      id: "lg-5",
      name: "不可抗力条款",
      description: "检查不可抗力范围、通知义务、法律后果是否明确",
      category: "legal",
      enabled: true,
      severity: "low",
    },
    {
      id: "lg-6",
      name: "合同终止条款",
      description: "检查合同解除、终止的条件和程序是否合理",
      category: "legal",
      enabled: true,
      severity: "medium",
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | "all">("all")
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
  const [configField, setConfigField] = useState("")
  const [configRegex, setConfigRegex] = useState("")
  const [configDescription, setConfigDescription] = useState("")
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false)
  const [newRuleName, setNewRuleName] = useState("")
  const [newRuleDescription, setNewRuleDescription] = useState("")
  const [newRuleCategory, setNewRuleCategory] = useState<RuleCategory>("general")
  const [newRuleSeverity, setNewRuleSeverity] = useState<"high" | "medium" | "low">("medium")

  const contractFields = [
    "客户名称",
    "供应商名称",
    "合同金额",
    "项目名称",
    "签订日期",
    "履行期限",
    "对方单位",
    "合同标题",
    "采购内容",
    "交付期限",
  ]

  const saveRuleConfig = () => {
    if (!selectedRule) return

    const updatedConfig = {
      field: configField,
      regex: configRegex,
      description: configDescription,
    }

    setRules(rules.map((rule) =>
      rule.id === selectedRule.id
        ? { ...rule, config: { ...rule.config, ...updatedConfig } }
        : rule
    ))

    // 重置表单
    setConfigField("")
    setConfigRegex("")
    setConfigDescription("")
    setSelectedRule(null)
  }

  const addNewRule = () => {
    if (!newRuleName || !newRuleDescription) return

    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      description: newRuleDescription,
      category: newRuleCategory,
      enabled: true,
      severity: newRuleSeverity,
      config: {},
    }

    setRules([...rules, newRule])

    // 重置表单
    setNewRuleName("")
    setNewRuleDescription("")
    setNewRuleCategory("general")
    setNewRuleSeverity("medium")
    setShowAddRuleDialog(false)
  }

  const categories = [
    { id: "all" as const, label: "全部规则", icon: Settings, color: "text-gray-600" },
    { id: "blacklist" as RuleCategory, label: "黑名单检查", icon: AlertTriangle, color: "text-red-600" },
    { id: "clause" as RuleCategory, label: "条款检查", icon: FileText, color: "text-blue-600" },
    { id: "amount" as RuleCategory, label: "金额检查", icon: DollarSign, color: "text-green-600" },
    { id: "general" as RuleCategory, label: "通用规则", icon: Settings, color: "text-gray-600" },
    { id: "finance" as RuleCategory, label: "财务规则", icon: DollarSign, color: "text-purple-600" },
    { id: "legal" as RuleCategory, label: "法务规则", icon: Shield, color: "text-orange-600" },
  ]

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const filteredRules = selectedCategory === "all" ? rules : rules.filter((r) => r.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-orange-100 text-orange-700"
      case "low":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return "未知"
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-balance">审批规则配置</h2>
        <p className="text-sm text-muted-foreground">
          配置合同审批过程中的自动检查规则，规则检查结果将显示在AI预审信息流中
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：分类导航 */}
        <Card className="p-4 h-fit">
          <h3 className="font-semibold mb-4 text-sm">规则分类</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon
              const count =
                category.id === "all" ? rules.length : rules.filter((r) => r.category === category.id).length
              const enabledCount =
                category.id === "all"
                  ? rules.filter((r) => r.enabled).length
                  : rules.filter((r) => r.category === category.id && r.enabled).length

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left
                    ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${selectedCategory === category.id ? "" : category.color}`} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold">{enabledCount}</span>
                    <span className="opacity-60">/{count}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* 右侧：规则列表 */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-balance">
                {categories.find((c) => c.id === selectedCategory)?.label || "全部规则"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                已启用 {filteredRules.filter((r) => r.enabled).length} / {filteredRules.length} 条规则
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddRuleDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增规则
            </Button>
          </div>

          <div className="space-y-3">
            {filteredRules.map((rule) => (
              <Card
                key={rule.id}
                className={`p-4 cursor-pointer ${rule.enabled ? "" : "opacity-60"} ${selectedRule?.id === rule.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => {
                  setSelectedRule(rule)
                  setConfigField(rule.config?.field || "")
                  setConfigRegex(rule.config?.regex || "")
                  setConfigDescription(rule.config?.description || "")
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-balance">{rule.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getSeverityColor(rule.severity)}`}>
                        严重度: {getSeverityLabel(rule.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>

                    {rule.config && (
                      <div className="bg-accent rounded-lg p-3 text-xs space-y-1">
                        <div className="font-medium text-muted-foreground mb-1">配置参数：</div>
                        {Object.entries(rule.config).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-mono">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 配置面板 */}
          {selectedRule && (
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">配置规则: {selectedRule.name}</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRule(null)}>
                  关闭
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">选择检查字段</label>
                  <select
                    value={configField}
                    onChange={(e) => setConfigField(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">请选择字段</option>
                    {contractFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">正则表达式</label>
                  <input
                    type="text"
                    value={configRegex}
                    onChange={(e) => setConfigRegex(e.target.value)}
                    placeholder="例如: ^[0-9]+$ (仅数字)"
                    className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    输入正则表达式来匹配字段内容，不匹配时触发规则检查
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">规则描述</label>
                  <textarea
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    placeholder="描述此规则的检查逻辑和目的"
                    className="w-full h-20 px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveRuleConfig} disabled={!configField || !configRegex}>
                    保存配置
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedRule(null)}>
                    取消
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 新增规则弹窗 */}
      <Dialog open={showAddRuleDialog} onOpenChange={setShowAddRuleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增审批规则</DialogTitle>
            <DialogDescription>
              创建新的合同审批规则，用于AI预审过程中的自动检查
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">规则名称</label>
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="请输入规则名称"
                className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">规则描述</label>
              <textarea
                value={newRuleDescription}
                onChange={(e) => setNewRuleDescription(e.target.value)}
                placeholder="描述规则的检查内容和目的"
                className="w-full h-20 px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">规则分类</label>
              <select
                value={newRuleCategory}
                onChange={(e) => setNewRuleCategory(e.target.value as RuleCategory)}
                className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="general">通用规则</option>
                <option value="blacklist">黑名单检查</option>
                <option value="clause">条款检查</option>
                <option value="amount">金额检查</option>
                <option value="finance">财务规则</option>
                <option value="legal">法务规则</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">严重程度</label>
              <select
                value={newRuleSeverity}
                onChange={(e) => setNewRuleSeverity(e.target.value as "high" | "medium" | "low")}
                className="w-full px-3 py-2 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={addNewRule} disabled={!newRuleName || !newRuleDescription}>
                创建规则
              </Button>
              <Button variant="outline" onClick={() => setShowAddRuleDialog(false)}>
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 导出规则检查函数，供AI预审使用
export function applyContractRules(contract: any, rules: Rule[]) {
  const enabledRules = rules.filter((r) => r.enabled)
  const results: any[] = []

  enabledRules.forEach((rule) => {
    // 模拟规则检查逻辑
    switch (rule.id) {
      case "bl-1":
      case "bl-2":
        // 黑名单检查
        const blacklist = rule.config?.blacklist || []
        const partyName = rule.id === "bl-1" ? contract.data["甲方名称"] : contract.data["乙方名称"]
        if (blacklist.some((b: string) => partyName?.includes(b))) {
          results.push({
            type: "error",
            title: `${rule.name}未通过`,
            description: `${partyName} 在企业黑名单中`,
            location: "合同抬头",
            severity: "critical",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        } else {
          results.push({
            type: "pass",
            title: `${rule.name}通过`,
            description: `${partyName} 不在黑名单中`,
            location: "合同抬头",
            severity: "none",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        }
        break

      case "am-1":
        // 金额上限检查
        const amount = Number.parseFloat(contract.data["合同金额"]?.replace(/[^0-9.]/g, "") || "0")
        const maxAmount = rule.config?.maxAmount || 5000000
        if (amount > maxAmount) {
          results.push({
            type: "error",
            title: rule.name,
            description: `合同金额 ${amount} 元超过审批授权额度 ${maxAmount} 元`,
            location: "第二条",
            severity: "critical",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        } else {
          results.push({
            type: "pass",
            title: rule.name,
            description: `合同金额在授权额度内`,
            location: "第二条",
            severity: "none",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        }
        break

      case "cl-3":
        // 违约金比例检查 - 随机检测
        if (Math.random() > 0.7) {
          results.push({
            type: "error",
            title: rule.name,
            description: "违约金比例超过公司规定的最高限额（0.5%）",
            location: "第七条第3款",
            severity: "critical",
            detail: "当前违约金比例0.5%已达上限，存在风险",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        } else {
          results.push({
            type: "pass",
            title: rule.name,
            description: "违约金比例符合公司规定",
            location: "第七条",
            severity: "none",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        }
        break

      case "fn-1":
        // 发票条款检查
        results.push({
          type: "warning",
          title: rule.name,
          description: "发票条款建议更明确",
          location: "第二条",
          severity: "medium",
          detail: "建议明确发票开具时间节点和发票类型",
          ruleId: rule.id,
          ruleName: rule.name,
        })
        break

      case "lg-1":
        // 知识产权条款检查
        results.push({
          type: "warning",
          title: rule.name,
          description: "知识产权归属约定可能存在争议风险",
          location: "第五条",
          severity: "medium",
          detail: "建议明确项目定制开发内容的知识产权归属",
          ruleId: rule.id,
          ruleName: rule.name,
        })
        break

      // 其他规则...
      default:
        // 默认通过
        if (Math.random() > 0.8) {
          results.push({
            type: "pass",
            title: rule.name,
            description: `${rule.description}检查通过`,
            location: "合同整体",
            severity: "none",
            ruleId: rule.id,
            ruleName: rule.name,
          })
        }
    }
  })

  return results
}

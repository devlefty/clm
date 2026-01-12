"use client"

import { useState } from "react"
import { FileText, ListTodo, Send, CheckCircle, BarChart3, Settings } from "lucide-react"
import { ContractTypeSelection } from "./contract-type-selection"
import { ContractDrafting } from "./contract-drafting"
import { ContractApproval } from "./contract-approval"
import { ContractLedger } from "./contract-ledger"
import { ContractTodos } from "./contract-todos"
import { ContractRulesConfig } from "./contract-rules-config"

type TabType = "todos" | "new" | "draft" | "approval" | "ledger" | "rules"

export function ContractManagementDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("todos")
  const [contracts, setContracts] = useState<any[]>([])

  const tabs = [
    { id: "todos" as TabType, label: "我的待办", icon: ListTodo },
    { id: "new" as TabType, label: "新建合同", icon: FileText },
    { id: "draft" as TabType, label: "合同起草", icon: Send },
    { id: "approval" as TabType, label: "审批流程", icon: CheckCircle },
    { id: "ledger" as TabType, label: "合同台账", icon: BarChart3 },
    { id: "rules" as TabType, label: "规则配置", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-balance">合同易</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>当前用户: 张三</span>
              <span className="text-border">|</span>
              <span>财务部</span>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b bg-card">
        <div className="container mx-auto px-6">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3.5 font-medium transition-colors relative text-sm
                    ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-6 py-6">
        {activeTab === "todos" && (
          <ContractTodos
            contracts={contracts}
            setContracts={setContracts}
            onNavigate={(tab: TabType) => setActiveTab(tab)}
          />
        )}
        {activeTab === "new" && (
          <ContractTypeSelection
            onContractCreated={(contract) => {
              setContracts([...contracts, contract])
              setActiveTab("draft")
            }}
          />
        )}
        {activeTab === "draft" && (
          <ContractDrafting
            contracts={contracts}
            setContracts={setContracts}
            onNavigate={(tab: TabType) => setActiveTab(tab)}
          />
        )}
        {activeTab === "approval" && (
          <ContractApproval
            contracts={contracts}
            setContracts={setContracts}
            onNavigate={(tab: TabType) => setActiveTab(tab)}
          />
        )}
        {activeTab === "ledger" && <ContractLedger contracts={contracts} />}
        {activeTab === "rules" && <ContractRulesConfig />}
      </main>
    </div>
  )
}

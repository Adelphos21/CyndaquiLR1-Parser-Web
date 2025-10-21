"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TablesSectionProps {
  data: any
}

export default function TablesSection({ data }: TablesSectionProps) {
  const actionTable = data.action_table || {}
  const gotoTable = data.goto_table || {}

  return (
    <Tabs defaultValue="action" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary/20">
        <TabsTrigger value="action">Tabla de Acciones</TabsTrigger>
        <TabsTrigger value="goto">Tabla Goto</TabsTrigger>
      </TabsList>

      <TabsContent value="action">
        <Card className="p-4 overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 bg-primary/10 text-primary font-semibold">Estado</th>
                {Object.values(actionTable)
                  .flatMap((row: any) => Object.keys(row))
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .sort()
                  .map((symbol) => (
                    <th key={symbol} className="text-left p-2 bg-primary/10 text-primary font-semibold">
                      {symbol}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(actionTable).map(([state, row]: [string, any]) => (
                <tr key={state} className="border-b border-border/50 hover:bg-secondary/5">
                  <td className="p-2 font-bold text-primary">{state}</td>
                  {Object.values(actionTable)
                    .flatMap((r: any) => Object.keys(r))
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort()
                    .map((symbol) => (
                      <td key={symbol} className="p-2 text-accent">
                        {row[symbol] || "-"}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </TabsContent>

      <TabsContent value="goto">
        <Card className="p-4 overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 bg-primary/10 text-primary font-semibold">Estado</th>
                {Object.values(gotoTable)
                  .flatMap((row: any) => Object.keys(row))
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .sort()
                  .map((symbol) => (
                    <th key={symbol} className="text-left p-2 bg-primary/10 text-primary font-semibold">
                      {symbol}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(gotoTable).map(([state, row]: [string, any]) => (
                <tr key={state} className="border-b border-border/50 hover:bg-secondary/5">
                  <td className="p-2 font-bold text-primary">{state}</td>
                  {Object.values(gotoTable)
                    .flatMap((r: any) => Object.keys(r))
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort()
                    .map((symbol) => (
                      <td key={symbol} className="p-2 text-accent">
                        {row[symbol] || "-"}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

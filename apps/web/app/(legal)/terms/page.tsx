import LogoIcon from "@/components/logo-icon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "利用規約 | Mutar",
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section className="mt-9">
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="space-y-3 leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export default async function Page() {
  return (
    <div className="sm:px-10 pb-10 px-5 mx-auto">
      <div className="max-w-200 mx-auto">
        <h2 className="pt-14 mb-18 text-3xl font-bold text-center flex items-center justify-center gap-3.5">
          <LogoIcon width={30} />
          利用規約
        </h2>

        <div className="leading-7 text-muted-foreground">
          本利用規約（以下「本規約」といいます。）は、当サービス（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用するすべての利用者（以下「利用者」といいます。）は、本規約に同意した上で本サービスを利用するものとします。
        </div>

        <Section title="第1条（適用）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              本規約は、本サービスの利用に関する一切の関係に適用されます。
            </li>
            <li>
              当サービス運営者（以下「運営者」といいます。）が本サービス上で掲載するルールその他の定めは、本規約の一部を構成するものとします。
            </li>
          </ol>
        </Section>

        <Section title="第2条（利用登録）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              利用登録を希望する者は、本規約に同意の上、所定の方法により登録を行うものとします。
            </li>
            <li>
              運営者は、登録申請者が不適当と判断した場合、登録を拒否することがあります。
            </li>
          </ol>
        </Section>

        <Section title="第3条（アカウント）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              利用者は自己の責任においてアカウントを管理するものとします。
            </li>
            <li>アカウントの第三者への貸与、譲渡又は共有は禁止します。</li>
            <li>アカウントを通じて行われた行為は、利用者本人によるものとみなします。</li>
          </ol>
        </Section>

        <Section title="第4条（利用料金）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>本サービスの一部は有料で提供される場合があります。</li>
            <li>利用料金、支払方法その他の条件は、本サービス上で別途定めます。</li>
            <li>法令に定めがある場合を除き、支払済みの料金は返金されません。</li>
          </ol>
        </Section>

        <Section title="第5条（禁止事項）">
          <p>
            利用者は、本サービスの利用にあたり、次の行為を行ってはなりません。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>法令又は公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>第三者の権利又は利益を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセス又はこれを試みる行為</li>
            <li>自動化された手段等により過度な負荷を与える行為</li>
            <li>本サービスを不正な目的で利用する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </Section>

        <Section title="第6条（知的財産権）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              本サービスに関する知的財産権は、運営者又は正当な権利者に帰属します。
            </li>
            <li>
              利用者が本サービスに入力又はアップロードしたコンテンツの権利は、当該利用者又は権利者に帰属します。
            </li>
            <li>
              利用者は、自らが必要な権利を有するコンテンツのみを本サービスへ提供するものとします。
            </li>
          </ol>
        </Section>

        <Section title="第7条（サービス内容の変更）">
          <p>
            運営者は、利用者への事前通知なく、本サービスの内容を変更、追加又は廃止することがあります。
          </p>
        </Section>

        <Section title="第8条（サービスの停止）">
          <p>
            運営者は、次の場合、本サービスの全部又は一部を停止することがあります。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>システム保守</li>
            <li>通信障害</li>
            <li>災害等の不可抗力</li>
            <li>その他運営上必要な場合</li>
          </ul>
        </Section>

        <Section title="第9条（免責）">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              運営者は、本サービスが利用者の期待する機能、正確性、完全性又は有用性を有することを保証しません。
            </li>
            <li>
              運営者は、本サービスの利用又は利用不能により生じた損害について、故意又は重過失がある場合を除き責任を負いません。
            </li>
            <li>
              運営者は、第三者サービスの利用に起因する損害について責任を負いません。
            </li>
          </ol>
        </Section>

        <Section title="第10条（利用停止）">
          <p>
            利用者が本規約に違反した場合、運営者は事前通知なく利用停止又はアカウント削除を行うことができます。
          </p>
        </Section>

        <Section title="第11条（規約の変更）">
          <p>
            運営者は、本規約を必要に応じて変更することができます。
          </p>
        </Section>

        <Section title="第12条（準拠法・裁判管轄）">
          <p>本規約は日本法に準拠します。</p>
          <p>
            本サービスに関する紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </Section>
      </div>
    </div>
  )
}

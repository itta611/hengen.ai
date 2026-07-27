import LogoIcon from "@/components/logo-icon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プライバシーポリシー | Mutar",
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
    <div>
      <div className="min-h-full pb-10 sm:px-10 px-5">
        <div className="max-w-200 mx-auto">
          <h2 className="pt-14 mb-18 text-3xl font-bold text-center flex items-center justify-center gap-3.5">
            <LogoIcon width={30} />
            プライバシーポリシー
          </h2>

          <div className="leading-7 text-muted-foreground">
            運営者は、本サービスにおける利用者情報の取扱いについて、以下のとおり定めます。
          </div>

          <Section title="1. 取得する情報">
            <p>運営者は、次の情報を取得する場合があります。</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>氏名又は表示名</li>
              <li>メールアドレス</li>
              <li>アカウント情報</li>
              <li>利用履歴</li>
              <li>IPアドレス</li>
              <li>Cookie等の識別情報</li>
              <li>利用者が本サービスに入力、送信又はアップロードした情報</li>
              <li>お問い合わせ内容</li>
              <li>その他本サービスの提供に必要な情報</li>
            </ul>
          </Section>

          <Section title="2. 利用目的">
            <p>取得した情報は、次の目的で利用します。</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>本サービスの提供</li>
              <li>本人確認</li>
              <li>サポート対応</li>
              <li>不正利用防止</li>
              <li>利用状況の分析</li>
              <li>品質改善</li>
              <li>障害対応</li>
              <li>法令への対応</li>
              <li>その他サービス運営に必要な目的</li>
            </ul>
          </Section>

          <Section title="3. 第三者提供">
            <p>
              運営者は、法令に基づく場合を除き、利用者の同意なく個人情報を第三者へ提供しません。
            </p>
            <p>
              ただし、本サービスの提供に必要な範囲で業務委託先へ情報を提供することがあります。
            </p>
          </Section>

          <Section title="4. 安全管理">
            <p>
              運営者は、利用者情報の漏えい、滅失又は毀損を防止するため、合理的な安全管理措置を講じます。
            </p>
          </Section>

          <Section title="5. Cookie等">
            <p>
              本サービスでは、Cookieその他これに類する技術を利用する場合があります。
            </p>
            <p>
              利用者はブラウザ設定によりCookieを無効にできますが、一部機能が利用できなくなる場合があります。
            </p>
          </Section>

          <Section title="6. アクセス解析">
            <p>
              本サービスでは、サービス改善のためアクセス解析ツールを利用する場合があります。
            </p>
          </Section>

          <Section title="7. 保存期間">
            <p>
              取得した情報は、利用目的の達成に必要な期間保存し、その後適切な方法により削除又は匿名化します。
            </p>
          </Section>

          <Section title="8. 開示等の請求">
            <p>
              利用者は、法令の定めに従い、自己の個人情報について開示、訂正、利用停止等を請求できます。
            </p>
          </Section>

          <Section title="9. ポリシーの変更">
            <p>
              運営者は、本ポリシーを必要に応じて変更できます。
            </p>
            <p>
              変更後の内容は、本サービス上に掲載した時点から効力を生じます。
            </p>
          </Section>

          <Section title="10. お問い合わせ">
            <p>
              本ポリシーに関するお問い合わせは、運営者が指定する連絡先までお願いします。
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}

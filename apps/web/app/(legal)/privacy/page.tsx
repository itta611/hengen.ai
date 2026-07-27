import type { Metadata } from "next"
import LogoIcon from "@/components/logo-icon"

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
            Mutar（以下「本サービス」といいます。）の運営者（以下「運営者」といいます。）は、本サービスにおける個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </div>

          <Section title="第1条（個人情報の定義）">
            <p>
              本ポリシーにおける「個人情報」、「個人データ」、「保有個人データ」及び「第三者提供記録」は、個人情報の保護に関する法律（平成15年法律第57号。以下「個人情報保護法」といいます。）に定めるものをいいます。
            </p>
          </Section>

          <Section title="第2条（個人情報の取得）">
            <p>運営者は、個人情報を適法かつ公正な手段により取得します。</p>
          </Section>

          <Section title="第3条（個人情報の利用目的）">
            <p>運営者は、取得した個人情報を次の目的で利用します。</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>本サービスの提供、運営及び維持のため</li>
              <li>利用登録、本人確認及び認証のため</li>
              <li>料金の請求及び決済のため</li>
              <li>本サービスに関する連絡及び案内のため</li>
              <li>お問い合わせへの対応のため</li>
              <li>
                利用規約に違反する行為又は不正な利用を防止し、対応するため
              </li>
              <li>
                本サービスの利用状況を調査及び分析し、改善又は開発を行うため
              </li>
              <li>法令上の義務を履行し、又は権利を行使するため</li>
              <li>前各号に付随する目的のため</li>
            </ol>
            <p>
              運営者は、変更前の利用目的と関連性を有すると合理的に認められる範囲で利用目的を変更することがあります。この場合、変更後の利用目的を本人に通知し、又は本サービス上で公表します。
            </p>
          </Section>

          <Section title="第4条（個人データの第三者提供）">
            <p>
              運営者は、次の場合を除き、あらかじめ本人の同意を得ることなく、個人データを第三者に提供しません。
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>法令に基づく場合</li>
              <li>
                人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合
              </li>
              <li>
                公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合
              </li>
              <li>
                国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合
              </li>
              <li>その他、個人情報保護法その他の法令で認められる場合</li>
            </ol>
          </Section>

          <Section title="第5条（個人データの取扱いの委託）">
            <p>
              運営者は、利用目的の達成に必要な範囲で、個人データの取扱いの全部又は一部を委託することがあります。この場合、運営者は、委託先を適切に選定し、必要かつ適切な監督を行います。
            </p>
            <p>
              外国にある第三者に個人データの取扱いを委託する場合、運営者は、個人情報保護法に従い、必要かつ適切な措置を講じます。
            </p>
          </Section>

          <Section title="第6条（外部サービスの利用）">
            <p>
              本サービスでは、決済のためにStripeを利用しています。Stripeが取得する情報の取扱いについては、
              <a
                className="underline underline-offset-4"
                href="https://stripe.com/jp/privacy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stripeのプライバシーポリシー
              </a>
              が適用されます。
            </p>
          </Section>

          <Section title="第7条（安全管理）">
            <p>
              運営者は、個人データの漏えい、滅失又は毀損の防止その他の個人データの安全管理のために、必要かつ適切な措置を講じます。
            </p>
            <p>
              運営者が講じる安全管理措置の内容については、第12条に定めるお問い合わせ窓口までご連絡ください。
            </p>
          </Section>

          <Section title="第8条（Cookie等の利用）">
            <p>
              本サービスでは、本サービスの提供、利便性の向上及び利用状況の把握のため、Cookieその他これに類する技術を利用することがあります。
            </p>
            <p>
              利用者は、ブラウザの設定によりCookieを無効にすることができます。ただし、その場合、本サービスの全部又は一部を利用できなくなることがあります。
            </p>
          </Section>

          <Section title="第9条（保存期間）">
            <p>
              運営者は、利用目的の達成に必要な範囲で、個人データを正確かつ最新の内容に保つよう努めます。また、利用目的の達成に必要な期間又は法令により保存が求められる期間、個人情報を保存し、保存する必要がなくなった場合は、遅滞なく消去するよう努めます。
            </p>
          </Section>

          <Section title="第10条（本人からの請求）">
            <p>
              本人は、個人情報保護法の定めに従い、運営者に対し、保有個人データの利用目的の通知、開示、訂正、追加、削除、利用停止若しくは消去、第三者提供の停止又は第三者提供記録の開示を請求することができます。
            </p>
            <p>
              開示等の請求を行う場合は、第12条に定めるお問い合わせ窓口までご連絡ください。運営者は、請求に必要な事項及び本人確認に必要な情報をご案内し、法令に従い対応します。
            </p>
            <p>
              運営者が請求の全部若しくは一部に応じない場合又は請求と異なる措置を講じる場合は、本人にその旨を通知し、理由を説明するよう努めます。
            </p>
          </Section>

          <Section title="第11条（本ポリシーの変更）">
            <p>
              運営者は、法令の改正又は本サービスの内容の変更等に応じて、本ポリシーを変更することがあります。重要な変更を行う場合は、本サービス上での掲載その他の適切な方法により通知します。法令上、本人の同意が必要となる変更については、運営者が定める方法により同意を得るものとします。
            </p>
          </Section>

          <Section title="第12条（お問い合わせ窓口）">
            <p>
              本ポリシーに関するお問い合わせ、苦情又は開示等の請求は、次の窓口までご連絡ください。
            </p>
            <p>メールアドレス：support@mutar.ai</p>
          </Section>

          <div className="mt-10 text-sm text-muted-foreground text-right">
            2026年7月27日 制定
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"

import {
  LegalDocument,
  LegalList,
  LegalSection,
} from "@/components/legal-document"

export const metadata: Metadata = {
  title: "Privacy Policy | Mutar",
}

export default function Page() {
  return (
    <LegalDocument
      effectiveDate="Established July 27, 2026"
      introduction='The operator of Mutar (the "Service") establishes this Privacy Policy (the "Policy") regarding the handling of personal information in connection with the Service.'
      title="Privacy Policy"
    >
      <LegalSection title="Article 1 (Definitions)">
        <p>
          The terms “personal information,” “personal data,” “retained personal
          data,” and “records of provision to third parties” have the meanings
          prescribed by Japan’s Act on the Protection of Personal Information
          (Act No. 57 of 2003; the “APPI”).
        </p>
      </LegalSection>

      <LegalSection title="Article 2 (Collection of Personal Information)">
        <p>
          The Operator collects personal information through lawful and fair
          means.
        </p>
      </LegalSection>

      <LegalSection title="Article 3 (Purposes of Use)">
        <p>The Operator uses collected personal information to:</p>
        <LegalList
          items={[
            "provide, operate, and maintain the Service;",
            "register users, verify identity, and authenticate users;",
            "bill users and process payments;",
            "send notices and information about the Service;",
            "respond to inquiries;",
            "prevent and address violations of the Terms of Service and unauthorized use;",
            "research and analyze use of the Service and improve or develop the Service;",
            "comply with legal obligations and exercise legal rights; and",
            "carry out purposes incidental to those listed above.",
          ]}
        />
        <p>
          The Operator may change a purpose of use to the extent reasonably
          related to the original purpose. The Operator will notify the relevant
          person or publish the revised purpose through the Service.
        </p>
      </LegalSection>

      <LegalSection title="Article 4 (Provision of Personal Data to Third Parties)">
        <p>
          The Operator will not provide personal data to a third party without
          the person’s prior consent, except when:
        </p>
        <LegalList
          items={[
            "required or permitted by law;",
            "necessary to protect a person’s life, body, or property and obtaining consent is difficult;",
            "particularly necessary to improve public health or promote the sound development of children and obtaining consent is difficult;",
            "cooperation with a national or local government body, or its contractor, is necessary to perform duties prescribed by law and obtaining consent could impede those duties; or",
            "otherwise permitted under the APPI or other applicable laws.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 5 (Entrustment of Personal Data Processing)">
        <p>
          The Operator may entrust all or part of the handling of personal data
          to the extent necessary to achieve the purposes of use. The Operator
          will select contractors appropriately and provide necessary and
          appropriate supervision.
        </p>
        <p>
          When entrusting personal data to a party outside Japan, the Operator
          will take necessary and appropriate measures in accordance with the
          APPI.
        </p>
      </LegalSection>

      <LegalSection title="Article 6 (External Services)">
        <p>
          The Service uses Stripe to process payments. Information collected by
          Stripe is governed by the{" "}
          <a
            className="underline underline-offset-4"
            href="https://stripe.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stripe Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Article 7 (Security Measures)">
        <p>
          The Operator takes necessary and appropriate measures to prevent the
          leakage, loss, or damage of personal data and otherwise manage personal
          data securely.
        </p>
        <p>
          Contact the inquiry address in Article 12 for information about the
          security measures taken by the Operator.
        </p>
      </LegalSection>

      <LegalSection title="Article 8 (Cookies and Similar Technologies)">
        <p>
          The Service may use cookies and similar technologies to provide the
          Service, improve convenience, and understand usage.
        </p>
        <p>
          Users may disable cookies in their browser settings. Doing so may make
          all or part of the Service unavailable.
        </p>
      </LegalSection>

      <LegalSection title="Article 9 (Retention Period)">
        <p>
          The Operator endeavors to keep personal data accurate and current to
          the extent necessary for the purposes of use. The Operator retains
          personal information for the period necessary to achieve those purposes
          or as required by law and endeavors to delete it promptly when it is no
          longer necessary.
        </p>
      </LegalSection>

      <LegalSection title="Article 10 (Requests from Individuals)">
        <p>
          In accordance with the APPI, an individual may request notification of
          purposes of use; disclosure, correction, addition, or deletion of
          retained personal data; suspension of use or erasure; suspension of
          provision to third parties; or disclosure of records of provision to
          third parties.
        </p>
        <p>
          Contact the inquiry address in Article 12 to submit a request. The
          Operator will explain the required information and identity verification
          process and respond in accordance with applicable law.
        </p>
        <p>
          If the Operator does not grant all or part of a request, or takes a
          different measure, the Operator will endeavor to notify the individual
          and explain the reason.
        </p>
      </LegalSection>

      <LegalSection title="Article 11 (Changes to this Policy)">
        <p>
          The Operator may amend this Policy in response to legal or service
          changes. Material changes will be announced through the Service or by
          another appropriate method. Where consent is legally required, the
          Operator will obtain it by the prescribed method.
        </p>
      </LegalSection>

      <LegalSection title="Article 12 (Contact)">
        <p>
          Direct inquiries, complaints, and requests for disclosure concerning
          this Policy to the following address.
        </p>
        <p>Email: support@mutar.ai</p>
      </LegalSection>
    </LegalDocument>
  )
}

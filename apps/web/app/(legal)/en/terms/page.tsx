import type { Metadata } from "next"

import {
  LegalDocument,
  LegalList,
  LegalSection,
} from "@/components/legal-document"

export const metadata: Metadata = {
  title: "Terms of Service | Mutar",
}

const registrationRefusalReasons = [
  "the information provided is false, inaccurate, or incomplete;",
  "the applicant has previously committed a material breach of these Terms;",
  "the applicant is an organized crime group or other antisocial force, or is involved with one; or",
  "there is another reasonable basis that would make providing the Service difficult.",
]

const suspensionReasons = [
  "maintenance, inspection, repair, or updates are required;",
  "a communications line, facility, or external service used by the Service fails;",
  "a disaster, power outage, epidemic, or other force majeure event makes provision difficult;",
  "action is required to address a security issue or prevent unauthorized use;",
  "required by law or an order from a public authority; or",
  "another unavoidable circumstance equivalent to those above occurs.",
]

const terminationReasons = [
  "the User breaches these Terms;",
  "the User fails to pay fees;",
  "registration information is found to contain a material falsehood;",
  "unauthorized use or a security risk is reasonably suspected;",
  "the User fails to respond to an important communication from the Operator for a reasonable period; or",
  "another reasonable circumstance makes continuation of the Agreement difficult.",
]

export default function Page() {
  return (
    <LegalDocument
      effectiveDate="Established July 27, 2026"
      introduction='These Terms of Service (the "Terms") set out the conditions for using Mutar (the "Service") provided by the operator of the Service (the "Operator") and the rights and obligations between the Operator and each person using the Service (a "User"). Users must agree to these Terms before using the Service.'
      title="Terms of Service"
    >
      <LegalSection title="Article 1 (Application)">
        <LegalList
          items={[
            "These Terms apply to all relationships between the Operator and Users concerning use of the Service.",
            "Usage conditions, notices, and other rules posted by the Operator through the Service form part of these Terms.",
            "If these Terms conflict with those rules, these Terms prevail unless the relevant rule expressly provides otherwise.",
            'When a User agrees to these Terms and begins using the Service, an agreement to use the Service incorporating these Terms (the "Service Agreement") is formed between the Operator and the User.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 2 (Registration)">
        <LegalList
          items={[
            "An applicant must agree to these Terms, provide accurate and current information, and register using the method specified by the Operator.",
            "A minor may use the Service only with the consent of a legal representative.",
            "A person using the Service for a company or other organization represents that they have authority to bind that organization to these Terms.",
            <div key="registration-refusal">
              The Operator may refuse registration or restrict use after
              registration if it reasonably determines that any of the following
              applies:
              <ol className="mt-2 list-[lower-alpha] space-y-2 pl-5">
                {registrationRefusalReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ol>
            </div>,
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 3 (Account Management)">
        <LegalList
          items={[
            "Users must accurately and securely manage their registration and authentication information at their own responsibility.",
            "Users may not transfer, lend, sell, share, or permit a third party to use their account.",
            "A User who learns that a third party has used, or may use, their account must promptly contact the Operator.",
            "Unless attributable to the Operator, actions performed using registered authentication information are treated as actions of the User who holds that account.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 4 (Use of the Service)">
        <LegalList
          items={[
            "Users may use the Service in accordance with these Terms and the conditions displayed through the Service.",
            "Users are responsible for obtaining, at their own cost, the devices, software, communications lines, and other environment needed to use the Service.",
            'Users should save, as necessary, images and other results created through the Service (the "Outputs") and other important data.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 5 (Paid Plans)">
        <LegalList
          items={[
            "Some parts of the Service are offered for a fee. Plan features, fees, usage limits, subscription periods, payment methods, and other conditions are displayed through the Service or in the commercial transaction disclosure.",
            "A paid-plan subscription is formed when the User applies and the prescribed payment procedure is completed.",
            "Unless cancelled by the prescribed method before the next renewal, a paid plan automatically renews for the same subscription period and the applicable fee is charged each time.",
            "Unless otherwise displayed, an upgrade takes effect immediately after completion and the prorated difference for the remaining subscription period is charged. A downgrade takes effect after the current subscription period ends.",
            "If the Operator changes fees, it will provide advance notice of the change and its effective date. New fees apply to subscription periods beginning on or after that date.",
            "If payment is not completed, the Operator may suspend the paid plan or limit use to the free tier.",
            "Unless required by law or separately approved by the Operator, no prorated calculation or refund is provided for cancellation during a subscription period.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 6 (Cancellation and Account Deletion)">
        <LegalList
          items={[
            "A User may cancel a paid plan at any time through the prescribed procedure. The plan ends at the end of the current subscription period and remains available until then.",
            "Cancelling a paid plan does not delete the account.",
            "A User may delete their account at any time through the prescribed procedure. Deletion ends the Service Agreement and any active paid plan and makes account-linked data inaccessible.",
            "Account deletion cannot be undone. Users must save necessary data before deleting their account.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 7 (User Content)">
        <LegalList
          items={[
            'Rights in text, images, and other information entered or uploaded by a User ("User Content") remain with the User or the lawful rights holder.',
            "Users represent that they hold all rights and permissions necessary to use their User Content with the Service.",
            "Users grant the Operator a royalty-free, non-exclusive license to reproduce, modify, transmit, and otherwise use User Content to the extent necessary to provide, operate, maintain, troubleshoot, and prevent misuse of the Service. This includes allowing contractors to handle User Content to the extent necessary for those purposes.",
            "The Operator will not make User Content public except at the User’s direction or with their consent, or when required by law.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 8 (Use of Outputs)">
        <LegalList
          items={[
            "Users may use Outputs in accordance with the usage conditions displayed through the Service and applicable law. Commercial-use and other conditions are those displayed for the applicable plan.",
            "If copyright or another right arises in an Output through a User’s creative contribution or otherwise, that right belongs to the User or other lawful rights holder.",
            "Outputs may be identical or similar to material created by third parties. The Operator does not warrant that Outputs are unique or do not infringe third-party rights.",
            "Before publishing, selling, or otherwise using an Output, Users must verify its accuracy and legality and that it does not infringe third-party rights.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 9 (Intellectual Property Rights)">
        <p>
          Intellectual property rights in the software, designs, text, images,
          trademarks, and other content comprising the Service belong to the
          Operator or lawful rights holders, except for rights retained by Users
          or third parties in User Content and Outputs. Use of the Service under
          these Terms does not transfer those rights or grant a license beyond
          what is necessary to use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Article 10 (Prohibited Conduct)">
        <p>Users must not:</p>
        <LegalList
          items={[
            "violate any law or public order and morals;",
            "engage in or encourage criminal conduct;",
            "infringe intellectual property, publicity, privacy, reputation, or other rights or interests of the Operator or a third party;",
            "enter or upload a third party’s personal, confidential, or other information without authority;",
            "use the Service or Outputs to impersonate, defraud, mislead, or otherwise harm a third party;",
            "create or use obscene, violent, discriminatory, or other content that causes serious harm to a third party;",
            "place an excessive load on, or interfere with, Service servers or networks;",
            "perform or attempt unauthorized access, circumvention of security features, or improper avoidance of usage restrictions;",
            "automate operation of the Service, collect information, or repeatedly access the Service by a method not approved by the Operator;",
            "copy, modify, analyze, or reverse engineer Service software beyond what is permitted by law;",
            "resell the Service or an account, or provide it for a third party without the Operator’s consent;",
            "provide benefits to, or participate in the activities of, antisocial forces; or",
            "engage in equivalent conduct that the Operator reasonably determines to be inappropriate.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 11 (Suspension or Interruption)">
        <LegalList
          items={[
            <div key="suspension-reasons">
              The Operator may suspend or interrupt all or part of the Service if:
              <ol className="mt-2 list-[lower-alpha] space-y-2 pl-5">
                {suspensionReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ol>
            </div>,
            "Where possible, the Operator will provide advance notice through the Service. This does not apply in an emergency.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 12 (Changes to or Termination of the Service)">
        <LegalList
          items={[
            "The Operator may change the Service when reasonably necessary to improve it, comply with law, or for another reasonable purpose.",
            "Before making a change that materially affects Users or terminating the entire Service, the Operator will provide reasonable advance notice unless urgent and unavoidable circumstances apply.",
            "If the Operator ends a paid plan during a subscription period for its own reasons without providing an alternative service, it will refund the fee corresponding to the unprovided period in accordance with applicable law.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 13 (Usage Restrictions and Cancellation of Registration)">
        <LegalList
          items={[
            <div key="termination-reasons">
              The Operator may temporarily restrict use or terminate the Service
              Agreement and delete an account if:
              <ol className="mt-2 list-[lower-alpha] space-y-2 pl-5">
                {terminationReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ol>
            </div>,
            "If a breach can be remedied, the Operator will generally provide a reasonable cure period. No advance notice or demand is required for a material breach, an emergency, or a breach that is difficult to remedy.",
            "Obligations owed by the User to the Operator when the Service Agreement ends survive termination.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 14 (Disclaimer of Warranties and Liability)">
        <LegalList
          items={[
            "Except as expressly stated in these Terms or through the Service, the Operator does not warrant uninterrupted or error-free operation, fitness for a particular purpose, or the accuracy, completeness, usefulness, currency, uniqueness, legality, or non-infringement of the Service or Outputs.",
            "Outputs are not a substitute for professional advice or judgment. Users must review and use Outputs at their own judgment and responsibility.",
            "The Operator is liable under applicable law for damage caused by matters attributable to it. Except in cases of intent or gross negligence, liability is limited to direct and ordinary damage actually incurred.",
            "If a dispute arises between a User and a third party concerning User Content or Outputs, the User must resolve it to the extent attributable to the User.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 15 (Personal Information)">
        <p>
          The Operator handles personal information in accordance with the{" "}
          <a className="underline underline-offset-4" href="/en/privacy">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Article 16 (Notices and Inquiries)">
        <LegalList
          items={[
            "The Operator may notify Users through the Service, by email to the registered address, or by another appropriate method.",
            "Direct inquiries concerning these Terms or the Service to the address below.",
          ]}
        />
        <p>Email: support@mutar.ai</p>
      </LegalSection>

      <LegalSection title="Article 17 (Assignment of Rights and Obligations)">
        <LegalList
          items={[
            "Without the Operator’s prior consent, Users may not assign, pledge, or otherwise dispose of their status under the Service Agreement or their rights or obligations under these Terms.",
            "If the Operator transfers the business relating to the Service to a third party, it may transfer its status under the Service Agreement, rights and obligations under these Terms, and User registration information to the transferee in accordance with applicable law.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 18 (Changes to these Terms)">
        <LegalList
          items={[
            <div key="terms-change-reasons">
              The Operator may amend these Terms in accordance with Article 548-4
              of the Civil Code of Japan if the amendment:
              <ol className="mt-2 list-[lower-alpha] space-y-2 pl-5">
                <li>conforms to the general interests of Users; or</li>
                <li>
                  is not contrary to the purpose of the Service Agreement and is
                  reasonable in light of its necessity, the appropriateness of
                  the revised content, and other relevant circumstances.
                </li>
              </ol>
            </div>,
            "When amending these Terms, the Operator will establish the revised content and effective date and announce them through the Service or another appropriate method before that date.",
            "For an amendment that legally requires User consent, the Operator will obtain consent by its prescribed method.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Article 19 (Severability)">
        <p>
          If any provision of these Terms, or any part of a provision, is found
          invalid or unenforceable under applicable law, the remaining provisions
          remain in effect.
        </p>
      </LegalSection>

      <LegalSection title="Article 20 (Governing Law and Jurisdiction)">
        <LegalList
          items={[
            "These Terms and the Service Agreement are governed by the laws of Japan.",
            "Any dispute concerning these Terms or the Service is subject to the exclusive agreed jurisdiction, in the first instance, of the district court or summary court having jurisdiction over the Operator’s address.",
          ]}
        />
      </LegalSection>
    </LegalDocument>
  )
}

import React from 'react'
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Section,
  Container,
  Preview,
  Text,
} from "@react-email/components"

import { Tailwind } from '@react-email/tailwind'

type ContactEmailProps = {
  message: string,
  senderEmail: string
}

export default function ContactFormEmail({ message, senderEmail }: ContactEmailProps) {
  return <Html>
    <Head />
    <Preview>New Message from Portfolio Site</Preview>
    <Tailwind>
      <Body className='bg-gray-100'>
        <Container>
          <Section className='bg-white border-black my-10 px-10 py-4 rounded-md'>
            <Heading className='leading-tight'>You recieved Email from Contact Form </Heading>
            <Text>{message}</Text>
            <Hr />
            <Text>Sender Email is : {senderEmail}</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
}


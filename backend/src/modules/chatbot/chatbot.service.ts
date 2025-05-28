model Chatbot {
  id            String    @id @default(uuid())
  tenantId      String    // multi-tenant : l'organisation propriétaire du chatbot
  name          String
  description   String?   
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  createdById   String    // utilisateur qui a créé ce chatbot
  createdBy     User      @relation(fields: [createdById], references: [id])

  conversations Conversation[]

  @@index([tenantId])
  @@index([createdById])
}

model Conversation {
  id            String    @id @default(uuid())
  chatbotId     String
  tenantId      String    // multi-tenant
  userId        String?   // utilisateur (donateur, opérateur, etc.) qui converse avec le chatbot
  startedAt     DateTime  @default(now())
  endedAt       DateTime?

  chatbot       Chatbot   @relation(fields: [chatbotId], references: [id])
  messages      Message[]

  @@index([chatbotId])
  @@index([tenantId])
  @@index([userId])
}

model Message {
  id              String    @id @default(uuid())
  conversationId  String
  sender          String    // exemple: 'user', 'bot', ou même 'operator'
  content         String
  sentAt          DateTime  @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id])

  @@index([conversationId])
}

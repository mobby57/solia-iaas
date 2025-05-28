model Analytics {
  id          String    @id @default(cuid())
  tenantId    String    // pour multi-tenant, l'organisation à laquelle appartient cette donnée
  userId      String?   // utilisateur (opérateur ou manager) associé (optionnel)
  missionId   String?   // mission liée à cette analytics (optionnel)
  eventType   String    // type d'événement analysé (ex : "donation_created", "mission_started", "operator_logged_in", etc.)
  eventDate   DateTime  @default(now()) // date et heure de l’événement
  metadata    Json?     // données supplémentaires flexibles au format JSON (ex : montant du don, durée, etc.)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  user        User?     @relation(fields: [userId], references: [id])
  mission     Mission?  @relation(fields: [missionId], references: [id])
  tenant      Organization @relation(fields: [tenantId], references: [id])

  @@index([tenantId, eventDate])
  @@index([userId])
}

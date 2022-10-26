export interface AuthorizeOwnerInterface {
  isOwner(currentUserId: string, objectId: string): Promise<boolean>
}

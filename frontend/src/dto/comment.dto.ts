export class CommentDto {
  public id!: string;
  public text!: string;
  public postDate!: string;
  public user!: {
    name: string;
    email: string;
    isPro: boolean;
    avatarUrl: string;
  };
  public rating!: number
}

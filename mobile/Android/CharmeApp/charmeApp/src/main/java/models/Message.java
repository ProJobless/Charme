package models;

public class Message {

	public String content;
	public String conversationId;
	public double timestamp;
	public String author;
    public String messageId;
    public int hasFile;
    public String fileId;
    public String userId;
	  @Override
  public String toString() {
    return new StringBuilder()

    .append("{ author=").append(author)
    .append(", message=").append(content)
            .append(", conversationId=").append(conversationId)
            .append(", time=").append(timestamp)
    .append("}").toString();
  }
}

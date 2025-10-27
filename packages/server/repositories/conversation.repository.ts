//Implementation detail (storing data in memory)
const conversations = new Map<string, string>();
//export an object with these two methods
export const conversationRepository = {
   //Export public interface of the module
   getLastResponseId(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastResponseId(conversationId: string, responseId: string) {
      conversations.set(conversationId, responseId);
   },
};

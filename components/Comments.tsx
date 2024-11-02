import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "./Thread";

type commentProps = {
  messageId: Id<"messages">;
};

const Comments = ({ messageId }: commentProps) => {
  const comments = useQuery(api.messages.getThreadComments, {
    messageId: messageId,
  });

  return (
    <View>
      {comments?.map((comment) => (
        <Thread
          key={comment._id}
          thread={comment as Doc<"messages"> & { creator: Doc<"users"> }}
        />
      ))}
    </View>
  );
};

export default Comments;

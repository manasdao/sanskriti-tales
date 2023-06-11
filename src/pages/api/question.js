import axios from "axios";
import Constants from "../../../Constants";
const url = "https://api.openai.com/v1/chat/completions";
export default async function handler(request, response) {
  const { story, question, childName } = request.body;
  console.log("key\n\n", story, typeof JSON.stringify(story), "\n\n");
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GPT_4_API_KEY}`,
    };
    let newStory = JSON.stringify(story);
    const messages = [
      {
        role: "system",
        content: `${Constants.questionSystemMessage} The child's name is "${childName}"`,
      },
      {
        role: "user",
        content: `Answer the question on this story: "${newStory}"
The question is: ${question}`,
      },
    ];

    const payload = {
      model: "gpt-4",
      messages,
    };

    const completion = await axios.post(url, payload, {
      headers,
      responseType: "stream",
    });

    const res = completion.data;

    res.on("data", (dataBuf) => {
      let datas = dataBuf.toString().split("\n");
      datas = datas
        .map((line) => line.replace(/^data: /, "").trim())
        .filter((line) => line !== "");

      for (let data of datas) {
        if (data === "[DONE]") {
          return response.end();
        }
        try {
          response.write(data);

          //   console.log("data\n\n", data, "\n\n");
          //   data = JSON.parse(`${data}`);
          //   const text = data.choices[0].content;
          //   if (text) {
          //     response.write(text);
          //   }
        } catch (error) {
          console.log(data);
          console.log(error);
        }
      }
    });
  } catch (error) {
    console.log("Error", error);
    return response.status(500).send(error);
  }
}

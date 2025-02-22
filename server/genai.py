import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompts = [
  "You will be given text from a audio file or conversation of between two users. you have to analyze the text thorowly and predict if the conversation is suspicious or not  with probability between 0 to 100 and reason. you can only give one object as output, and accuracy is very important here. Few samples are given below.  is very important here. Few samples are given below.",
  "input: Hello sir, I am calling from your bank's security team. We detected unauthorized transactions. Please install AnyDesk so we can secure your account.",
  "output: {'fraud_probability': 100, 'reason': 'The caller is asking the user to install AnyDesk, which is a common tactic used by scammers to gain remote access to the user's computer.'}",
  "input: Sir, your maintenance bill for this month is ₹2,500. Please make the payment at your earliest convenience.",
  "output: {\"fraud_probability\": 0, \"reason\": \"Request for maintenance bill payment is a normal occurrence.\"}",
  "input: fraud URGENT! Your Mobile number has been awarded with a 2000 rupee prize GUARANTEED. Call 09061790126 from land line. Claim 3030. Valid 12hrs only 150ppm",
  "output: {\"fraud_probability\": 100, \"reason\": \"The message claims the recipient has won a prize and urges them to call a number from a landline, which is a common characteristic of scam messages.\"}",
]

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model1 = genai.GenerativeModel(
  model_name="gemini-2.0-flash",
  generation_config=generation_config,
)

def gen_ai_json(question, prompts=prompts):
  prompts.append(f"input: {question}")
  prompts.append("output: ")
  response = model1.generate_content(prompts)
  return  response.text
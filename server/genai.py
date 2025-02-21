import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

prompts = [
    "You will be given text from a audio file or conversation of between two users. you have to analyze the text and predict if the conversation is suspicious or not. You can use the following text as a sample input",
    "input: Hello sir, I am calling from your bank's security team. We detected unauthorized transactions. Please install AnyDesk so we can secure your account.",
    "output: {'fraud_probability': 100, 'reason': 'The caller is asking the user to install AnyDesk, which is a common tactic used by scammers to gain remote access to the user's computer.'}",
    "input: Sir, your maintenance bill for this month is ₹2,500. Please make the payment at your earliest convenience. ",
    "output: {'fraud_probability': 0, 'reason': 'The message is a legitimate request for payment of a maintenance bill.'}",
    "input: fraud	URGENT! Your Mobile number has been awarded with a 2000 rupee prize GUARANTEED. Call 09061790126 from land line. Claim 3030. Valid 12hrs only 150ppm",
    "output: {'fraud_probability': 100, 'reason': 'The message is a common scam message that promises a prize in exchange for calling a premium rate number.'}",
]

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

generation_config_json = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model1 = genai.GenerativeModel(
  model_name="gemini-1.5-flash-8b",
  generation_config=generation_config_json,
)

def gen_ai_json(question, prompts=prompts):
  prompts.append(f"input: {question}")
  prompts.append("output: ")
  response = model1.generate_content(prompts)
  return  response.text
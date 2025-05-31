from typing import Optional, Tuple
import random
import time
from openai import OpenAI
from app.config import settings


class GPTService:
    def __init__(self):
        self._client = None
        self.prompt_refiner_template = """
You are a technical assistant. Rewrite the user's vague or informal input into a precise, well-structured, and technically appropriate prompt for GPT to process. 

Consider the requested response style: {style}

Style Guidelines:
- concise: Request brief, direct answers with key points only
- detailed: Request comprehensive, thorough explanations with examples
- casual: Request friendly, conversational tone with relatable language
- professional: Request formal, business-appropriate language and structure
- educational: Request informative responses with examples, analogies, and learning aids
- balanced: Request well-rounded responses that are neither too brief nor too verbose

User Input:
"{user_input}"

Response Style Requested: {style}

Rewritten Prompt:
"""

    @property
    def client(self):
        """Lazy initialization of OpenAI client"""
        if settings.mock_mode:
            return None  # Don't initialize client in mock mode
        if self._client is None:
            # Create an HTTP client with proxies disabled to avoid passing proxy args
            import httpx
            no_proxy_client = httpx.Client(proxies=None)
            self._client = OpenAI(
                api_key=settings.openai_api_key,
                http_client=no_proxy_client
            )
        return self._client

    def _get_style_description(self, style: str) -> str:
        """Get description for the style to use in mock responses"""
        style_descriptions = {
            'concise': 'brief and to-the-point',
            'detailed': 'comprehensive and thorough',
            'casual': 'friendly and conversational',
            'professional': 'formal and business-like',
            'educational': 'informative with examples',
            'balanced': 'well-rounded'
        }
        return style_descriptions.get(style, 'balanced')

    def _generate_mock_refinement(self, user_input: str, style: str = "balanced") -> str:
        """Generate a realistic mock refinement"""
        # Simulate processing time
        time.sleep(0.1 + random.random() * 0.3)
        
        style_instructions = {
            'concise': "Provide a brief, direct explanation",
            'detailed': "Provide a comprehensive, detailed explanation with examples and context",
            'casual': "Explain in a friendly, conversational way that's easy to understand",
            'professional': "Provide a formal, structured explanation suitable for business contexts",
            'educational': "Explain with clear examples, analogies, and step-by-step breakdowns for learning",
            'balanced': "Provide a well-rounded explanation that balances detail with clarity"
        }
        
        instruction = style_instructions.get(style, style_instructions['balanced'])
        
        refinements = [
            f"{instruction} of {user_input}, including key concepts, practical applications, and relevant examples. Structure your response appropriately for the requested tone and ensure technical accuracy while maintaining accessibility.",
            f"{instruction} about {user_input}. Cover the fundamental principles, current developments, and practical implications. Use appropriate language and depth for the requested style.",
            f"{instruction} regarding {user_input}. Include background context, core mechanisms, and real-world applications. Ensure the explanation matches the requested tone and complexity level."
        ]
        return random.choice(refinements)

    def _generate_mock_response(self, refined_prompt: str, style: str = "balanced") -> str:
        """Generate a realistic mock final response"""
        # Simulate processing time
        time.sleep(0.2 + random.random() * 0.5)
        
        style_desc = self._get_style_description(style)
        
        if style == 'concise':
            responses = [
                f"Here's a concise overview:\n\n{refined_prompt[:80]}...\n\nKey points:\n• Core functionality and purpose\n• Main benefits and applications\n• Current status and adoption\n\nThis represents an important development in the field with practical applications across various industries.",
                f"Brief summary:\n\n{refined_prompt[:70]}...\n\nEssentials:\n- Primary mechanisms\n- Key advantages\n- Common use cases\n\nSignificant impact on modern technology and business practices."
            ]
        elif style == 'detailed':
            responses = [
                f"Comprehensive Analysis:\n\n{refined_prompt[:100]}...\n\nDetailed Overview:\nThis topic encompasses multiple interconnected systems and methodologies that have evolved significantly over recent years. The fundamental architecture involves sophisticated algorithms and data processing techniques that enable advanced functionality.\n\nCore Components:\n1. Primary processing mechanisms and their optimization strategies\n2. Integration frameworks and compatibility considerations\n3. Performance metrics and scalability factors\n4. Security protocols and data protection measures\n\nPractical Applications:\nThe technology finds extensive use across various sectors including healthcare, finance, manufacturing, and telecommunications. Each implementation requires careful consideration of specific requirements and constraints.\n\nFuture Developments:\nOngoing research focuses on improving efficiency, reducing costs, and expanding capabilities. Emerging trends suggest significant potential for innovation and market growth.\n\nConclusion:\nThis represents a transformative technology with far-reaching implications for how we approach complex problem-solving in the digital age.",
                f"In-Depth Examination:\n\n{refined_prompt[:120]}...\n\nFoundational Principles:\nThe underlying concepts are rooted in established scientific and engineering principles, enhanced by modern computational capabilities and innovative design approaches.\n\nTechnical Architecture:\n• Advanced processing algorithms with optimized performance characteristics\n• Robust data management systems ensuring reliability and scalability\n• Comprehensive security frameworks protecting against various threat vectors\n• User interface designs prioritizing accessibility and functionality\n\nImplementation Considerations:\nSuccessful deployment requires careful planning, stakeholder engagement, and phased rollout strategies. Organizations must consider factors such as existing infrastructure, staff training requirements, and change management processes.\n\nMarket Impact and Adoption:\nIndustry analysis reveals growing adoption rates across multiple sectors, driven by demonstrated ROI and competitive advantages. Early adopters report significant improvements in operational efficiency and customer satisfaction.\n\nLong-term Outlook:\nExperts predict continued evolution and refinement, with emerging technologies likely to enhance capabilities further. Investment in research and development remains strong, indicating sustained innovation potential."
            ]
        elif style == 'casual':
            responses = [
                f"Hey! So you're asking about this topic - let me break it down for you in simple terms:\n\n{refined_prompt[:90]}...\n\nBasically, think of it like this: it's a pretty cool system that helps solve real problems in a smart way. The main idea is to make things work better and faster than traditional methods.\n\nWhat makes it interesting:\n• It's actually not as complicated as it sounds\n• People are using it for all sorts of practical stuff\n• The results are pretty impressive when done right\n\nThe bottom line? It's one of those technologies that's quietly making a big difference in how we do things, and it's only getting better. Pretty neat stuff if you ask me!",
                f"Great question! This is actually a really fascinating area:\n\n{refined_prompt[:85]}...\n\nSo here's the deal - imagine you have a problem that's been bugging people for ages, and suddenly someone comes up with a clever way to tackle it. That's essentially what we're looking at here.\n\nWhy it's cool:\n- It takes complex stuff and makes it manageable\n- Real people are seeing real benefits\n- It's not just theoretical - it actually works\n\nThe fun part is watching how different industries are picking this up and running with it. Everyone's finding their own creative ways to use it, which is pretty awesome to see!"
            ]
        elif style == 'professional':
            responses = [
                f"Executive Summary:\n\n{refined_prompt[:100]}...\n\nStrategic Overview:\nThis technology represents a significant advancement in operational capabilities, offering measurable improvements in efficiency, cost-effectiveness, and competitive positioning. Organizations implementing these solutions report substantial returns on investment and enhanced market differentiation.\n\nBusiness Impact:\n• Streamlined operational processes with reduced overhead costs\n• Enhanced data-driven decision-making capabilities\n• Improved customer satisfaction and retention metrics\n• Strengthened competitive advantage in target markets\n\nImplementation Framework:\nSuccessful deployment requires structured project management, stakeholder alignment, and phased rollout strategies. Key considerations include resource allocation, timeline management, and risk mitigation protocols.\n\nRecommendations:\nOrganizations should conduct thorough feasibility assessments, develop comprehensive implementation roadmaps, and establish clear success metrics. Executive sponsorship and cross-functional collaboration are essential for optimal outcomes.",
                f"Business Analysis:\n\n{refined_prompt[:110]}...\n\nMarket Position:\nCurrent market dynamics indicate strong growth potential and increasing enterprise adoption. Leading organizations are leveraging these capabilities to drive innovation and operational excellence.\n\nValue Proposition:\n- Quantifiable improvements in key performance indicators\n- Reduced operational complexity and associated costs\n- Enhanced scalability and future-readiness\n- Strengthened regulatory compliance and risk management\n\nStrategic Considerations:\nDecision-makers should evaluate alignment with organizational objectives, resource requirements, and implementation timelines. Due diligence should include vendor assessment, total cost of ownership analysis, and change management planning."
            ]
        elif style == 'educational':
            responses = [
                f"Learning Guide:\n\n{refined_prompt[:95]}...\n\nLet's explore this step by step to build a solid understanding:\n\n📚 Fundamental Concepts:\nThink of this like learning to drive a car - you need to understand the basic components before you can operate the whole system effectively. The core principles involve [key concept 1], [key concept 2], and [key concept 3].\n\n🔍 How It Works (Simple Analogy):\nImagine you're organizing a large library. Traditional methods might involve manually cataloging each book, but this approach is like having an intelligent system that automatically understands, categorizes, and retrieves information based on what you need.\n\n💡 Real-World Examples:\n• Example 1: How it's used in everyday applications you might recognize\n• Example 2: Industry-specific implementations and their benefits\n• Example 3: Emerging use cases and future possibilities\n\n🎯 Key Takeaways:\n- Start with understanding the basic principles\n- See how these principles apply in practice\n- Recognize the broader implications and potential\n\n📖 Next Steps for Learning:\nTo deepen your understanding, consider exploring [related topic 1], [related topic 2], and hands-on examples in your area of interest.",
                f"Educational Overview:\n\n{refined_prompt[:105]}...\n\n🎓 Learning Objectives:\nBy the end of this explanation, you'll understand the what, why, and how of this topic, plus be able to identify practical applications.\n\n📋 Background Context:\nThis field emerged from the need to solve specific challenges that traditional approaches couldn't handle effectively. Think of it as evolution in problem-solving - each generation builds on previous knowledge to create better solutions.\n\n🔧 Core Mechanisms (Simplified):\nBreaking it down into digestible parts:\n1. Input Processing: How information enters the system\n2. Analysis Phase: What happens to that information\n3. Output Generation: How results are produced and delivered\n\n🌟 Practical Applications:\nTo make this concrete, here are some scenarios you might encounter:\n• Scenario A: [Specific example with clear benefits]\n• Scenario B: [Different context showing versatility]\n• Scenario C: [Future possibility to spark imagination]\n\n✅ Self-Check Questions:\n- Can you explain the main concept in your own words?\n- What problems does this solve?\n- How might you use this in your field or interests?\n\n🚀 Further Exploration:\nReady to dive deeper? Look into [advanced topic 1] and [advanced topic 2] for more specialized knowledge."
            ]
        else:  # balanced
            responses = [
                f"Balanced Overview:\n\n{refined_prompt[:100]}...\n\nThis topic represents an important development that balances innovation with practical application. The core concept involves sophisticated yet accessible approaches to solving real-world challenges.\n\nKey Aspects:\n• Technical foundation built on proven principles\n• Practical applications across multiple domains\n• Ongoing development and refinement\n• Growing adoption and market acceptance\n\nPractical Implications:\nOrganizations and individuals are finding value through improved efficiency, enhanced capabilities, and new opportunities for innovation. The technology strikes a good balance between complexity and usability.\n\nLooking Forward:\nContinued evolution is expected, with improvements in performance, accessibility, and integration capabilities. This represents a mature yet dynamic field with solid foundations and promising future developments.",
                f"Comprehensive Summary:\n\n{refined_prompt[:90]}...\n\nThis area combines theoretical understanding with practical implementation, offering both immediate benefits and long-term potential. The approach is methodical yet flexible, allowing for adaptation to various needs and contexts.\n\nCore Elements:\n- Established methodologies with proven track records\n- Innovative applications addressing current challenges\n- Scalable solutions suitable for different organizational sizes\n- Integration capabilities with existing systems and processes\n\nCurrent Status:\nThe field has reached a level of maturity that enables reliable implementation while maintaining room for continued innovation. Users report positive outcomes across various metrics including efficiency, cost-effectiveness, and user satisfaction.\n\nFuture Outlook:\nExpected developments include enhanced capabilities, broader accessibility, and deeper integration with emerging technologies. The trajectory suggests sustained growth and continued relevance in addressing evolving needs."
            ]
        
        return random.choice(responses)

    def call_gpt(self, prompt: str, model: Optional[str] = None) -> str:
        """Make a call to GPT with the given prompt"""
        if settings.mock_mode:
            # Determine if this is a refinement call or final response call
            if "Rewrite the user's vague or informal input" in prompt:
                # Extract user input and style from the refinement template
                try:
                    user_input = prompt.split('User Input:\n"')[1].split('"\n\nResponse Style Requested:')[0]
                    style = prompt.split('Response Style Requested: ')[1].split('\n\nRewritten Prompt:')[0]
                    return self._generate_mock_refinement(user_input, style)
                except:
                    # Fallback for old format
                    user_input = prompt.split('User Input:\n"')[1].split('"\n\nRewritten Prompt:')[0]
                    return self._generate_mock_refinement(user_input)
            else:
                # This could be a final response call or a direct prompt call
                style = "balanced"  # default
                
                # Check if this is a direct prompt with style guidance
                if prompt.startswith("Provide a brief, direct answer."):
                    style = "concise"
                    # Extract the actual user input after the guidance
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                elif prompt.startswith("Provide a comprehensive, detailed answer"):
                    style = "detailed"
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                elif prompt.startswith("Answer in a friendly, conversational tone"):
                    style = "casual"
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                elif prompt.startswith("Provide a formal, business-appropriate answer"):
                    style = "professional"
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                elif prompt.startswith("Provide an informative answer"):
                    style = "educational"
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                elif prompt.startswith("Provide a well-rounded, balanced answer"):
                    style = "balanced"
                    user_input = prompt.split("\n\n", 1)[1] if "\n\n" in prompt else prompt
                    return self._generate_mock_response(user_input, style)
                else:
                    # Try to extract style from prompt content for refined prompts
                    if "concise" in prompt.lower():
                        style = "concise"
                    elif "detailed" in prompt.lower() or "comprehensive" in prompt.lower():
                        style = "detailed"
                    elif "casual" in prompt.lower() or "friendly" in prompt.lower():
                        style = "casual"
                    elif "professional" in prompt.lower() or "formal" in prompt.lower():
                        style = "professional"
                    elif "educational" in prompt.lower() or "learning" in prompt.lower():
                        style = "educational"
                    
                    return self._generate_mock_response(prompt, style)
        
        if model is None:
            model = settings.default_model
        # Make real GPT API call using client (with proxies disabled)
        try:
            client = self.client
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"GPT API call failed: {str(e)}")

    def refine_prompt(self, raw_input: str, style: str = "balanced") -> Tuple[str, float]:
        """Refine the user's raw input into a better prompt"""
        start_time = time.time()
        refinement_prompt = self.prompt_refiner_template.format(
            user_input=raw_input, 
            style=style
        )
        refined = self.call_gpt(refinement_prompt, model=settings.refinement_model)
        end_time = time.time()
        return refined, (end_time - start_time) * 1000

    def generate_final_answer(self, refined_prompt: str) -> Tuple[str, float]:
        """Generate the final answer using the refined prompt"""
        start_time = time.time()
        answer = self.call_gpt(refined_prompt, model=settings.default_model)
        end_time = time.time()
        return answer, (end_time - start_time) * 1000

    def generate_direct_answer(self, user_input: str, style: str = "balanced") -> Tuple[str, float]:
        """Generate answer directly from user input without refinement"""
        start_time = time.time()
        
        # Add style guidance to the direct prompt
        style_guidance = {
            'concise': "Provide a brief, direct answer.",
            'detailed': "Provide a comprehensive, detailed answer with examples.",
            'casual': "Answer in a friendly, conversational tone.",
            'professional': "Provide a formal, business-appropriate answer.",
            'educational': "Provide an informative answer with examples and explanations.",
            'balanced': "Provide a well-rounded, balanced answer."
        }
        
        guidance = style_guidance.get(style, style_guidance['balanced'])
        styled_prompt = f"{guidance}\n\n{user_input}"
        
        answer = self.call_gpt(styled_prompt, model=settings.default_model)
        end_time = time.time()
        return answer, (end_time - start_time) * 1000

    def process_user_input(self, raw_input: str, style: str = "balanced", skip_refinement: bool = False) -> Tuple[str, str, str, float, float, float]:
        """
        Complete processing pipeline: refine prompt and generate answer, or process directly
        Returns: (refined_prompt, final_answer, model_used, total_time_ms, refinement_time_ms, generation_time_ms)
        """
        total_start = time.time()
        
        if skip_refinement:
            # Process directly without refinement
            final_answer, generation_time = self.generate_direct_answer(raw_input, style)
            refined_prompt = raw_input  # Use original input as "refined" prompt for logging
            refinement_time = 0.0  # No refinement time
        else:
            # Use the normal two-stage process
            refined_prompt, refinement_time = self.refine_prompt(raw_input, style)
            final_answer, generation_time = self.generate_final_answer(refined_prompt)
        
        total_end = time.time()
        total_time = (total_end - total_start) * 1000
        
        return refined_prompt, final_answer, settings.default_model, total_time, refinement_time, generation_time


# Global instance
gpt_service = GPTService() 
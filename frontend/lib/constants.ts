export const DEMO_FACTS = {
  true: [
    "The capital of France is Paris. It is known for the Eiffel Tower, which was completed in 1889.",
    "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
    "The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states.",
    "Water is composed of two hydrogen atoms and one oxygen atom.",
    "The speed of light in a vacuum is approximately 299,792,458 meters per second."
  ],
  fake: [
    "The moon is made of green cheese and was discovered by Buzz Aldrin in 1969 during the Apollo 11 mission.",
    "Albert Einstein invented the iPhone in 1955 as a secret project for the US military.",
    "The Great Barrier Reef is located off the coast of California and is primarily made of plastic waste.",
    "Humans can breathe underwater without equipment if they train their lungs for 3 weeks.",
    "The internet was created by ancient Egyptians using fiber optic cables made from papyrus."
  ],
  mixed: [
    "Water boils at 100 degrees Celsius at sea level. However, in the city of Atlantis, it freezes when heated.",
    "Mount Everest is the highest mountain on Earth. It was first climbed by Sir Edmund Hillary and Tenzing Norgay in 1853.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible. It was invented by the ancient Romans.",
    "The human heart pumps blood throughout the body. It is located in the right side of the chest and stops beating when you sneeze.",
    "Leonardo da Vinci painted the Mona Lisa. He also invented the first functional helicopter in 1505 which he used to commute to work."
  ],
};

export const DEMO_CITATIONS = {
  correct: `Residual connections help deep neural networks train effectively and enabled very deep "ResNet" architectures.
He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR) (pp. 770–778).`,
  wrongYear: `Residual connections help deep neural networks train effectively.
He, K., Zhang, X., Ren, S., & Sun, J. (2015). Deep residual learning for image recognition. In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR) (pp. 770–778).`,
  wrongVenue: `Residual connections help deep neural networks train effectively.
He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. Nature, 770–778.`,
};

export const HALLUCINATION_FACTS = [
  {
    type: "damage",
    text: "AI hallucinations can lead to significant financial losses for businesses relying on automated decision-making.",
  },
  {
    type: "benefit",
    text: "Verifying AI output ensures the integrity of research and prevents the spread of scientific misinformation.",
  },
  {
    type: "damage",
    text: "In legal contexts, hallucinated case citations have led to sanctions and damaged professional reputations.",
  },
  {
    type: "benefit",
    text: "Cross-referencing claims builds trust with users by demonstrating a commitment to factual accuracy.",
  },
  {
    type: "damage",
    text: "Medical hallucinations in AI can provide dangerous or incorrect health advice if not properly audited.",
  },
];

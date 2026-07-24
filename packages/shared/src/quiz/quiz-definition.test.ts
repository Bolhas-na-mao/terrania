import { describe, expect, it } from "vitest";

import { quizDefinitionSchema, type QuizDefinition } from "./quiz-definition.ts";

const validMapPinQuiz = {
  answerMode: "pin",
  description: "Find countries in South America by clicking the map.",
  format: "map",
  id: "south-america-countries-pin",
  prompt: {
    template: "Click on {target}",
  },
  rules: {
    attempts: {},
    feedback: {
      afterAnswer: "immediate",
      revealCorrectAnswer: true,
    },
    ordering: "random",
    scoring: {
      mode: "basic",
      penaltyPerIncorrect: 0,
      pointsPerCorrect: 1,
    },
    timer: {
      mode: "elapsed",
    },
  },
  scope: {
    id: "south-america",
    kind: "continent",
    label: "South America",
  },
  subject: "countries",
  targets: [
    {
      acceptedAnswers: ["Brazil", "Brasil"],
      id: "brazil",
      label: "Brazil",
      map: {
        featureId: "BRA",
      },
    },
    {
      acceptedAnswers: ["Argentina"],
      id: "argentina",
      label: "Argentina",
      map: {
        featureId: "ARG",
      },
    },
  ],
  title: "South America Countries",
} satisfies QuizDefinition;

const parseQuiz = (quiz: unknown) => quizDefinitionSchema.safeParse(quiz);

describe("quizDefinitionSchema", () => {
  it("accepts a valid map pin quiz definition", () => {
    const result = parseQuiz(validMapPinQuiz);

    expect(result.success).toBe(true);
  });

  it("rejects a quiz without targets", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      targets: [],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Quiz needs at least one target",
          path: ["targets"],
        }),
      ]),
    );
  });

  it("rejects duplicate target ids", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      targets: [
        validMapPinQuiz.targets[0],
        {
          ...validMapPinQuiz.targets[1],
          id: validMapPinQuiz.targets[0].id,
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Duplicate target id: brazil",
          path: ["targets", 1, "id"],
        }),
      ]),
    );
  });

  it("rejects map pin targets without map feature ids", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      targets: [
        {
          acceptedAnswers: ["Brazil"],
          id: "brazil",
          label: "Brazil",
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Map pin targets need a map feature id",
          path: ["targets", 0, "map", "featureId"],
        }),
      ]),
    );
  });

  it("accepts future flag multiple choice vocabulary without map data", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      answerMode: "multiple_choice",
      format: "flag",
      targets: [
        {
          acceptedAnswers: ["Brazil", "Brasil"],
          id: "brazil",
          label: "Brazil",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects countdown timers without seconds", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      rules: {
        ...validMapPinQuiz.rules,
        timer: {
          mode: "countdown",
        },
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Countdown timer needs seconds",
          path: ["rules", "timer", "seconds"],
        }),
      ]),
    );
  });

  it("rejects elapsed timers with seconds", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      rules: {
        ...validMapPinQuiz.rules,
        timer: {
          mode: "elapsed",
          seconds: 120,
        },
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Elapsed timer does not use seconds",
          path: ["rules", "timer", "seconds"],
        }),
      ]),
    );
  });

  it("rejects negative scoring values", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      rules: {
        ...validMapPinQuiz.rules,
        scoring: {
          ...validMapPinQuiz.rules.scoring,
          penaltyPerIncorrect: -1,
        },
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Incorrect penalty cannot be negative",
          path: ["rules", "scoring", "penaltyPerIncorrect"],
        }),
      ]),
    );
  });

  it("rejects empty accepted answers", () => {
    const result = parseQuiz({
      ...validMapPinQuiz,
      targets: [
        {
          ...validMapPinQuiz.targets[0],
          acceptedAnswers: ["Brazil", ""],
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Accepted answers cannot be empty",
          path: ["targets", 0, "acceptedAnswers", 1],
        }),
      ]),
    );
  });
});

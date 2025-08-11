import request from "supertest";
import { createApp } from "../../lib/index";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../../lib/db/index";
import { User } from "../../lib/db/models/user";
import { Company } from "../../lib/db/models/company";
import { faker } from "@faker-js/faker";
import { supabase } from "../../lib/services/supabaseClient";
import { SOCIAL_AUTH_TYPE, STATUS } from "../../lib/utils/enums/enums";

jest.mock("../../lib/services/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

describe("User Auth Routes", () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    // Start MongoDB Memory Server
    await connectTestDB();
    app = createApp();
  });

  afterEach(async () => {
    // Clear the database and mocks after each test
    await clearTestDB();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close connections after all tests
    await disconnectTestDB();
  });

  // ---------------------
  // Register Route Tests
  // ---------------------
  describe("POST /api/auth/register", () => {
    const mockUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: {
        first: faker.person.firstName(),
        last: faker.person.lastName(),
      },
      supabaseUserId: faker.string.uuid(),
    };

    /*
      Make sure that each test follows the below AAA pattern i.e. Arrange, Act, Assert
    */
    it("should send an error response if email and passwords are not provided", async () => {
      // Arrange
      const emptyUser = {};

      // Act
      const response = await request(app)
        .post("/api/auth/register")
        .send(emptyUser);

      // Assert
      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(Object.keys(response.body.errors).length).toBeGreaterThan(0);
    });

    it("should send an error response if the user already exists in DB", async () => {
      await User.create(mockUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists!");
    });

    it("should send an error response if the supabase account for the user already exists", async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: {
          message: "User already exists!",
        },
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists!");
    });

    it("should send a success response if all the inputs are valid", async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: {
          user: {
            id: mockUser.supabaseUserId,
          },
        },
        error: null,
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Success.");
      expect(response.body.data.token.length).toBeGreaterThan(0);
      expect(Object.keys(response.body.data.user).length).toBeGreaterThan(0);
    });
  });

  // ------------------
  // Login Route Tests
  // ------------------
  describe("POST /api/auth/login", () => {
    const mockUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: {
        first: faker.person.firstName(),
        last: faker.person.lastName(),
      },
      supabaseUserId: faker.string.uuid(),
    };

    it("should send an error response if empty inputs are provided", async () => {
      const emptyUser = {};

      const response = await request(app)
        .post("/api/auth/login")
        .send(emptyUser);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(true);
      expect(Object.keys(response.body.errors).length).toBeGreaterThan(0);
    });

    it("should send an error response if the user's oauth field is already set", async () => {
      const newUser = { ...mockUser, oauth: SOCIAL_AUTH_TYPE.GOOGLE };
      await User.create(newUser);

      const response = await request(app).post("/api/auth/login").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "You have registered through GOOGLE !",
      );
    });

    it("should send an error response if the supabase credentials are invalid", async () => {
      await User.create(mockUser);
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: {
          message: "Invalid credentials",
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should send an error response if the user doesn't exist", async () => {
      await User.create(mockUser);
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: {
          user: {
            id: faker.string.uuid(),
          },
        },
        error: null,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Your account doesnt exists please signup",
      );
    });

    it("should send an error response if the user account is disabled", async () => {
      const newUser = { ...mockUser, status: STATUS.INACTIVE };
      const userDetails = await User.create(newUser);
      const companyDetails = {
        name: userDetails.email,
        userRef: userDetails._id,
        status: STATUS.INACTIVE,
      };
      await Company.create(companyDetails);
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: {
          user: {
            id: newUser.supabaseUserId,
          },
        },
        error: null,
      });

      const response = await request(app).post("/api/auth/login").send(newUser);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Your account is disabled");
    });

    it("should send a success response if the given user details are valid", async () => {
      const userDetails = await User.create(mockUser);
      const companyDetails = {
        name: userDetails.email,
        userRef: userDetails._id,
      };
      await Company.create(companyDetails);
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: {
          user: {
            id: mockUser.supabaseUserId,
          },
        },
        error: null,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token.length).toBeGreaterThan(0);
      expect(Object.keys(response.body.data.user).length).toBeGreaterThan(0);
    });
  });

  // --------------------------
  // Social Signup Route Tests
  // --------------------------
  describe("POST /api/auth/social-signup", () => {
    const mockUser = {
      name: {
        first: faker.person.firstName(),
        last: faker.person.lastName(),
      },
      supabaseUserId: faker.string.uuid(),
      oauth: SOCIAL_AUTH_TYPE.APPLE,
    };

    it("should send an error response if required fields are not provided", async () => {
      const emptyUser = {};

      const response = await request(app)
        .post("/api/auth/social-signup")
        .send({ user: emptyUser });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(Object.keys(response.body.errors).length).toBeGreaterThan(0);
    });

    it("should send an error response if the user's email is not associated with the apple account", async () => {
      const response = await request(app)
        .post("/api/auth/social-signup")
        .send({ user: mockUser });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Email should be associated with the apple account!",
      );
    });

    it("should send a success response if all the inputs are valid", async () => {
      const newUser = {
        ...mockUser,
        email: faker.internet.email(),
        oauth: SOCIAL_AUTH_TYPE.GOOGLE,
      };

      const response = await request(app)
        .post("/api/auth/social-signup")
        .send({ user: newUser });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully.");
      expect(response.body.data.token.length).toBeGreaterThan(0);
      expect(Object.keys(response.body.data.user).length).toBeGreaterThan(0);
    });
  });
});

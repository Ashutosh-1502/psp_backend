import request from "supertest";
import { createApp } from "../../lib/index";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../../lib/db/index";
import { seedProducts } from "../../lib/db/seeders/product";
import { Products } from "../../lib/db/models/products";
import { Types } from "mongoose";
import { faker } from "@faker-js/faker";
import { STATUS } from "../../lib/utils/enums/enums";

let userRef: string;
let companyRef: string;

jest.mock("../../lib/services/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock the Middleware class
jest.mock("../../lib/middleware/auth", () => {
  return {
    Middleware: jest.fn().mockImplementation(() => {
      return {
        systemMiddleware: (req, res, next) => next(),
        superAdminMiddleware: (req, res, next) => next(),
        adminMiddleware: (req, res, next) => next(),
        authMiddleware: (req, res, next) => next(),
        jwtDecoder: (req, res, next) => {
          req.user = { userRef, companyRef };
          next();
        },
      };
    }),
  };
});

describe("Products Routes", () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    await connectTestDB();
    // Clear the database before seeding
    await clearTestDB();
    app = createApp();

    userRef = String(new Types.ObjectId());
    companyRef = String(new Types.ObjectId());

    await seedProducts({
      userRef,
      companyRef,
    });
  });

  afterAll(async () => {
    await clearTestDB();
    await disconnectTestDB();
  });

  describe("GET api/products", () => {
    it("should return all products with pagination", async () => {
      const response = await request(app).get(
        "/api/products?page=1&pageSize=10",
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].page).toBe(1);
      expect(response.body.data[0].pageSize).toBe(10);
      expect(response.body.data[0].items.length).toBe(10);
    });

    it("should return a paginated response", async () => {
      const response = await request(app).get(
        "/api/products?page=2&pageSize=5",
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].page).toBe(2);
      expect(response.body.data[0].pageSize).toBe(5);
      expect(response.body.data[0].items.length).toBe(5);
    });

    it("should return an empty array for a page that exceeds the total number of products", async () => {
      const response = await request(app).get(
        "/api/products?page=3&pageSize=10",
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].page).toBe(3);
      expect(response.body.data[0].pageSize).toBe(10);
      expect(response.body.data[0].items.length).toBe(0);
    });
  });

  describe("GET api/products/:id", () => {
    it("should return single product when valid id is provided", async () => {
      const product = await Products.findOne();
      const response = await request(app).get(`/api/products/${product?._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(product?.title);
    });

    it("should return an error response when invalid id is provided", async () => {
      const response = await request(app).get("/api/products/invalid-id");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      );
    });
  });

  describe("POST api/admin/products", () => {
    it("should send an error response if empty input is provided", async () => {
      const emptyProduct = {};

      const response = await request(app)
        .post("/api/admin/products")
        .send(emptyProduct);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(Object.keys(response.body.errors).length).toBeGreaterThan(0);
    });

    it("should send a success response valid product details are provided", async () => {
      const mockProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        userRef,
        companyRef,
      };

      const response = await request(app)
        .post("/api/admin/products")
        .send(mockProduct);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(mockProduct.title);
    });
  });

  describe("PUT api/admin/products/:id", () => {
    it("should send an error response if given id doesnt exist", async () => {
      const mockProduct = {
        title: faker.commerce.productName(),
      };
      const productId = String(new Types.ObjectId());

      const response = await request(app)
        .put(`/api/admin/products/${productId}`)
        .send(mockProduct);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Bad request. check the body");
    });

    it("should send an error response if invalid id is provided", async () => {
      const mockProduct = {
        title: faker.commerce.productName(),
      };

      const response = await request(app)
        .put(`/api/admin/products/invalid-id`)
        .send(mockProduct);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Cast to ObjectId failed for value "invalid-id" (type string) at path "_id" for model "Products"',
      );
    });

    it("should send a success response once the product is updated successfully", async () => {
      const product = await Products.findOne();
      const updatedProduct = {
        title: faker.commerce.productName(),
      };

      const response = await request(app)
        .put(`/api/admin/products/${product?._id}`)
        .send(updatedProduct);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updatedProduct.title);
    });
  });

  describe("DELETE api/admin/products/:id", () => {
    it("should send a success response if the product is deleted successfully", async () => {
      const product = await Products.findOne({
        status: STATUS.ACTIVE,
      });

      const response = await request(app).delete(
        `/api/admin/products/${product?._id}`,
      );

      const deletedProduct = await Products.findById(product?._id);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(deletedProduct?.status).toBe(STATUS.DELETED);
    });
  });
});

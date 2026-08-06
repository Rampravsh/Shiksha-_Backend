import { UploadsService } from "../src/modules/uploads/uploads.service";
import { UploadsRepository } from "../src/modules/uploads/uploads.repository";
import { BadRequestError } from "../src/core/errors";
import {
  uploadImageBuffer,
  deleteCloudinaryAsset,
} from "../src/integrations/cloudinary";
import { Upload } from "@prisma/client";

jest.mock("../src/integrations/cloudinary", () => ({
  uploadImageBuffer: jest.fn(),
  deleteCloudinaryAsset: jest.fn(),
}));

describe("Uploads Module Unit Tests", () => {
  let uploadsRepository: jest.Mocked<UploadsRepository>;
  let uploadsService: UploadsService;

  beforeEach(() => {
    uploadsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UploadsRepository>;

    uploadsService = new UploadsService(uploadsRepository);
    jest.clearAllMocks();
  });

  it("should fetch paginated uploads list", async () => {
    const mockUploads = [
      { id: "up-1", publicId: "shiksha/img1" },
    ] as unknown as Upload[];
    uploadsRepository.findAll.mockResolvedValue([mockUploads, 1]);

    const result = await uploadsService.getAllUploads(
      {},
      { skip: 0, limit: 10, page: 1 },
    );

    expect(result.data).toHaveLength(1);
  });

  it("should upload image buffer file to Cloudinary and save upload record", async () => {
    const mockFile = {
      buffer: Buffer.from("test image data"),
      originalname: "test.png",
      mimetype: "image/png",
    } as Express.Multer.File;

    (uploadImageBuffer as jest.Mock).mockResolvedValue({
      public_id: "shiksha/test-1",
      url: "http://res.cloudinary.com/test-1.png",
      secure_url: "https://res.cloudinary.com/test-1.png",
      format: "png",
      bytes: 1024,
      folder: "shiksha/questions",
    });

    uploadsRepository.create.mockResolvedValue({
      id: "up-1",
      publicId: "shiksha/test-1",
      secureUrl: "https://res.cloudinary.com/test-1.png",
    } as unknown as Upload);

    const result = await uploadsService.uploadFile(
      "user-1",
      mockFile,
      "shiksha/questions",
    );

    expect(result.publicId).toBe("shiksha/test-1");
    expect(uploadImageBuffer).toHaveBeenCalledWith(
      mockFile.buffer,
      "shiksha/questions",
    );
  });

  it("should throw BadRequestError if file is missing", async () => {
    await expect(
      uploadsService.uploadFile("user-1", undefined),
    ).rejects.toThrow(BadRequestError);
  });

  it("should delete upload from Cloudinary and database", async () => {
    const mockUpload = {
      id: "up-1",
      publicId: "shiksha/test-1",
    } as unknown as Upload;
    uploadsRepository.findById.mockResolvedValue(mockUpload);
    (deleteCloudinaryAsset as jest.Mock).mockResolvedValue(true);
    uploadsRepository.delete.mockResolvedValue(mockUpload);

    const result = await uploadsService.deleteUpload("up-1");

    expect(result.id).toBe("up-1");
    expect(deleteCloudinaryAsset).toHaveBeenCalledWith("shiksha/test-1");
  });
});

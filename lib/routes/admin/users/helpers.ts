import { PaginatedSearchQuery } from "@/utils/interfaces/common/query";
import { User as users } from "@/db/models/user";
import { ObjectId } from "@/utils/helpers/commonHelper";
import { createFacetPipeline } from "@/utils/helpers/queryHelper";

export class AdminUsersHelpers {
  public static findAll = async (query: PaginatedSearchQuery) => {
    const page = query.page;
    const pageSize = query.pageSize;
    const searchValue = query.searchValue;
    const skips = (page - 1) * pageSize;
    const companyRef = query.companyRef;
    const facetPipeline = createFacetPipeline(page, skips, pageSize);

    return users.aggregate([
      {
        $match: {
          companyRef: ObjectId(companyRef),
          ...(searchValue && searchValue.length
            ? {
                $text: { $search: searchValue },
              }
            : {}),
        },
      },
      ...facetPipeline,
    ]);
  };

  public static findOne = async (id: string) => {
    return users.findById(id);
  };

  public static updateStatus = async (
    id: string,
    companyRef: string,
    status: string,
  ) => {
    return users.findOneAndUpdate(
      { $and: [{ _id: id }, { companyRef }] },
      {
        $set: {
          status,
        },
      },
      { returnDocument: "after" },
    );
  };

  public static changeUserRole = async (
    userId: string,
    companyRef: string,
    roles: string,
  ) => {
    return users.updateOne({ _id: userId, companyRef }, { roles });
  };
}

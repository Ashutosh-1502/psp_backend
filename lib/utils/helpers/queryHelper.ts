function createFacetPipeline(page: number, skips: number, pageSize: number) {
  return [
    {
      $facet: {
        items: [{ $skip: skips }, { $limit: pageSize }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $addFields: {
        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
        page: page,
        pageSize: pageSize,
      },
    },
    {
      $project: { items: 1, total: 1, page: 1, pageSize: 1 },
    },
  ];
}

export { createFacetPipeline };

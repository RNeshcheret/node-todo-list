const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_LIMIT = 100;

function getPagination(query) {
  const page = query?.page || DEFAULT_PAGE;
  const limit = query?.limit || DEFAULT_PAGE_LIMIT;
  const offset = (page - 1) * limit;

  return {
    offset,
    limit,
  };
}

module.exports = { getPagination };

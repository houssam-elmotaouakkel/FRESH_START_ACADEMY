/**
 * Unit tests — API response helpers
 */
const { successResponse, errorResponse, createdResponse, paginatedResponse } = require('../src/utils/apiResponse');

// Tiny mock for Express `res`
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('apiResponse.successResponse', () => {
  test('returns 200 with success:true by default', () => {
    const res = mockRes();
    successResponse(res, { id: 1 }, 'OK');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'OK',
      data: { id: 1 },
    });
  });

  test('allows custom status code', () => {
    const res = mockRes();
    successResponse(res, null, 'Accepted', 202);
    expect(res.status).toHaveBeenCalledWith(202);
  });
});

describe('apiResponse.errorResponse', () => {
  test('returns 500 by default', () => {
    const res = mockRes();
    errorResponse(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  test('includes errors array when provided', () => {
    const res = mockRes();
    const errs = [{ field: 'email', message: 'required' }];
    errorResponse(res, 'Validation', 400, errs);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: errs })
    );
  });
});

describe('apiResponse.createdResponse', () => {
  test('returns 201', () => {
    const res = mockRes();
    createdResponse(res, { id: 42 });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('apiResponse.paginatedResponse', () => {
  test('computes pagination metadata correctly', () => {
    const res = mockRes();
    paginatedResponse(res, [1, 2, 3], { page: 2, limit: 10, total: 25 });

    const body = res.json.mock.calls[0][0];
    expect(body.pagination.totalPages).toBe(3);
    expect(body.pagination.hasNextPage).toBe(true);
    expect(body.pagination.hasPrevPage).toBe(true);
    expect(body.pagination.currentPage).toBe(2);
    expect(body.pagination.totalItems).toBe(25);
  });

  test('hasPrevPage is false on first page', () => {
    const res = mockRes();
    paginatedResponse(res, [], { page: 1, limit: 10, total: 5 });
    const body = res.json.mock.calls[0][0];
    expect(body.pagination.hasPrevPage).toBe(false);
  });
});

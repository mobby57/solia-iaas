const mainSchemaName = "tenants";

// Function to add a tenant document to the database
const addATenantRepo = async (
  dbConn,
  tenantData,
  session = null
) => {
  const sessionOption = {};
  if (session) {
    sessionOption.session = session;
  }
  const data = await dbConn
    .model(mainSchemaName)
    .create([tenantData], sessionOption);
  return data[0];
};

// Function to get a tenant document by query
const getATenantRepo = async (
  dbConn,
  findQuery,
  selectQuery = {}
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .findOne(findQuery)
    .select(selectQuery)
    .lean();
  return data;
};

// Function to get multiple tenant documents
const getTenantsRepo = async (
  dbConn,
  selectQuery = {}
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .find({})
    .select(selectQuery)
    .lean();
  return data;
};

// Function to update a tenant document by query
const updateATenantRepo = async (
  dbConn,
  findQuery,
  updateQuery
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .updateOne(findQuery, updateQuery);
  return data;
};

// Function to delete a tenant document by query
const deleteATenantRepo = async (
  dbConn,
  findQuery
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .deleteOne(findQuery);
  return data;
};


export { addATenantRepo, getATenantRepo, getTenantsRepo, updateATenantRepo, deleteATenantRepo };

const mainSchemaName = "users";

// Function to add a user document to the database
const addAUserRepo = async (
  dbConn,
  userData,
  session = null
) => {
  const sessionOption = {};
  if (session) {
    sessionOption.session = session;
  }
  const data = await dbConn
    .model(mainSchemaName)
    .create([userData], sessionOption);
  return data[0];
};

// Function to get a user document by query
const getAUserRepo = async (
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

// Function to update a user document by query
const updateAUserRepo = async (
  dbConn,
  findQuery,
  updateQuery
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .updateOne(findQuery, updateQuery);
  return data;
};

// Function to delete a user document by query
const deleteAUserRepo = async (
  dbConn,
  findQuery
) => {
  const data = await dbConn
    .model(mainSchemaName)
    .deleteOne(findQuery);
  return data;
};

export { addAUserRepo, getAUserRepo, updateAUserRepo, deleteAUserRepo };

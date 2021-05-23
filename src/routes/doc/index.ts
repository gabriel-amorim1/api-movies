/* eslint-disable @typescript-eslint/no-var-requires */
const definitionPaginate = require('./definitionsData/paginate.json');
const definitionUserOrAdmin = require('./definitionsData/userOrAdmin.json');
const definitionSession = require('./definitionsData/session.json');
const definitionMovie = require('./definitionsData/movie.json');

export default {
    ...definitionPaginate,
    ...definitionUserOrAdmin,
    ...definitionSession,
    ...definitionMovie,
};

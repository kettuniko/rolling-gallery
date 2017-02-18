const getParameter = queryString => name =>
  Maybe.of(queryString)
    .map(params => params.split(`${name}=`))
    .map(([_, rest]) => rest)
    .map(rest => rest.split('&'))
    .map(([value, _]) => value)
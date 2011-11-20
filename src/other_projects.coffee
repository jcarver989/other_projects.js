load_script = (src, onload_callback) ->
  script = document.createElement("script")
  script.type = "text/javascript"
  script.src = src
  script.onload = onload_callback if onload_callback?
  document.getElementsByTagName("head")[0].appendChild(script)

jquery_url     = "http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"
github_api_url = "https://raw.github.com/jcarver989/GithubApi.js/master/github_api.js"
execute_main = -> load_script github_api_url, main

if typeof jQuery == "undefined" then load_script(jquery_url, execute_main) else execute_main()

main = ->
  $(document).ready ->
    api = Github.API
    user = window.github_username

    inject_css = () ->
      style = $("<link>") 
      style.attr {
        type: "text/css"
        rel: "stylesheet"
        href: "other_projects.css"
      }

      $("head").append style

    extract_repo_info = (repo) ->
      {
        name       : repo.name.toLowerCase()
        url        : repo.homepage || repo.html_url
        description: repo.description
      }

    repo_html = (repo) ->
      """
    <a href='#{repo.url}'>
      <dt>#{repo.name}</dt>
      <dd>#{repo.description}</dd>
    </a>
      """

    create_header = -> $("<h2>click for other projects by <strong>#{user}</strong></h2>")

    create_columns = (repos, num_columns = 3) ->
      num_repos = repos.length
      step_size = Math.round(num_repos / num_columns)
      columns = ($("<dl class='one-third column'>") for i in [0..num_columns-1])

      start = 0
      end   = step_size-1
      column_index = 0

      while start < num_repos
        for index in [start..end]
          column = columns[column_index]
          column.append $(repo_html(repos[index]))

        start += step_size
        end   = start + step_size-1
        column_index +=1
     
      while start < num_repos
        columns[column_index].append $(repo_html(repos[start]))
        start += 1

      columns

    add_repo_info_to_bar = (repos) ->
      inject_css()

      info = $("<div class='info'></div>")
      header = create_header()
      info.append header 
      row = $("<div class='row'>")

      header.click (e) ->
        if row.is(":visible")
          row.slideUp(200)
        else
          row.slideDown(200)
      
      row.append(column) for column in create_columns(repos)
      info.append row

      bar = $("<div id='otherProjects'>")
      bar.append info

      $("body").append bar

    api.get_repos user, (repos) ->
      sorted = repos.sort (a,b) ->
        a_name = a.name
        b_name = b.name
        return 0 if a_name == b_name
        if (a_name > b_name) then 1 else -1

      list = (extract_repo_info(repo) for repo in sorted)
      add_repo_info_to_bar(list)

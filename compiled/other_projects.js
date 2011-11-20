
  $(document).ready(function() {
    var add_repo_info_to_bar, api, create_columns, create_header, extract_repo_info, inject_css, repo_html, user;
    api = Github.API;
    user = window.github_username;
    inject_css = function() {
      var style;
      style = $("<link>");
      style.attr({
        type: "text/css",
        rel: "stylesheet",
        href: "other_projects.css"
      });
      return $("head").append(style);
    };
    extract_repo_info = function(repo) {
      return {
        name: repo.name.toLowerCase(),
        url: repo.homepage || repo.html_url,
        description: repo.description
      };
    };
    repo_html = function(repo) {
      return "<a href='" + repo.url + "'>\n  <dt>" + repo.name + "</dt>\n  <dd>" + repo.description + "</dd>\n</a>";
    };
    create_header = function() {
      return $("<h2>click for other projects by <strong>" + user + "</strong></h2>");
    };
    create_columns = function(repos, num_columns) {
      var column, column_index, columns, end, i, index, num_repos, start, step_size;
      if (num_columns == null) num_columns = 3;
      num_repos = repos.length;
      step_size = Math.round(num_repos / num_columns);
      columns = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = num_columns - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          _results.push($("<dl class='one-third column'>"));
        }
        return _results;
      })();
      start = 0;
      end = step_size - 1;
      column_index = 0;
      while (start < num_repos) {
        for (index = start; start <= end ? index <= end : index >= end; start <= end ? index++ : index--) {
          column = columns[column_index];
          column.append($(repo_html(repos[index])));
        }
        start += step_size;
        end = start + step_size - 1;
        column_index += 1;
      }
      while (start < num_repos) {
        columns[column_index].append($(repo_html(repos[start])));
        start += 1;
      }
      return columns;
    };
    add_repo_info_to_bar = function(repos) {
      var bar, column, header, info, row, _i, _len, _ref;
      inject_css();
      info = $("<div class='info'></div>");
      header = create_header();
      info.append(header);
      row = $("<div class='row'>");
      header.click(function(e) {
        if (row.is(":visible")) {
          return row.slideUp(200);
        } else {
          return row.slideDown(200);
        }
      });
      _ref = create_columns(repos);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        row.append(column);
      }
      info.append(row);
      bar = $("<div id='otherProjects'>");
      bar.append(info);
      return $("body").append(bar);
    };
    return api.get_repos(user, function(repos) {
      var list, repo, sorted;
      sorted = repos.sort(function(a, b) {
        var a_name, b_name;
        a_name = a.name;
        b_name = b.name;
        if (a_name === b_name) return 0;
        if (a_name > b_name) {
          return 1;
        } else {
          return -1;
        }
      });
      list = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sorted.length; _i < _len; _i++) {
          repo = sorted[_i];
          _results.push(extract_repo_info(repo));
        }
        return _results;
      })();
      return add_repo_info_to_bar(list);
    });
  });
